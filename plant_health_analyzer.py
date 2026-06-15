# -*- coding: utf-8 -*-
"""
植物 AI 管理系统
ICT English group project

更新版功能：
1. 从云端 PostgreSQL 数据库读取最新植物传感器数据。
2. 从云端 PostgreSQL 数据库读取植物健康标准数据。
3. 如果数据库中没有植物健康标准数据，就使用本文件内置的 DEFAULT_PLANT_STANDARDS。
4. 不再使用本地规则判断；最终状态由 Gemini 根据标准数据和传感器数据分析。
5. 最终植物状态只分为以下五类：Bad, Slightly Bad, Normal, Slightly Good, Good。

需要安装的库：
  pip install google-genai psycopg2-binary

推荐设置的环境变量：
  DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
  GEMINI_API_KEY="your Gemini API key"

可选环境变量：
  SENSOR_TABLE="plant_health_data"
  SENSOR_ORDER_COLUMNS="created_at,Timestamp,timestamp,measured_at,id"
  SENSOR_PLANT_ID_COLUMN=""       # 例：Plant_ID 或 plant_id。空字符串表示不按植物 ID 过滤。
  PLANT_ID="monstera"
  STANDARDS_TABLE="plant_standards"
  STANDARDS_PLANT_ID_COLUMN="plant_id"
"""

import json
import os
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict, Iterable, Optional


# ============================================================
# 1. 基本设置
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_JSON = BASE_DIR / "plant_status_output.json"
GEMINI_MODEL = "gemini-2.5-flash"

PLANT_ID = os.getenv("PLANT_ID", "monstera")
SENSOR_TABLE = os.getenv("SENSOR_TABLE", "plant_health_data")
SENSOR_PLANT_ID_COLUMN = os.getenv("SENSOR_PLANT_ID_COLUMN", "").strip()
SENSOR_ORDER_COLUMNS = [
    col.strip()
    for col in os.getenv(
        "SENSOR_ORDER_COLUMNS",
        "created_at,Timestamp,timestamp,measured_at,id",
    ).split(",")
    if col.strip()
]

STANDARDS_TABLE = os.getenv("STANDARDS_TABLE", "plant_standards")
STANDARDS_PLANT_ID_COLUMN = os.getenv("STANDARDS_PLANT_ID_COLUMN", "plant_id")

FINAL_STATUS_VALUES = [
    "Bad",
    "Slightly Bad",
    "Normal",
    "Slightly Good",
    "Good",
]

# 当 PostgreSQL 中没有植物健康标准数据时，使用这里的默认标准。
DEFAULT_PLANT_STANDARDS: Dict[str, Any] = {
    "plant_id": "monstera",
    "name_cn": "龟背竹",
    "name_en": "Monstera Deliciosa",
    "care_standards": {
        "soil_moisture": {
            "critical_low": 20,
            "warn_low": 35,
            "optimal": "40-60",
            "warn_high": 75,
            "critical_high": 85,
            "unit": "%",
        },
        "ambient_temperature": {
            "critical_low": 10,
            "warn_low": 15,
            "optimal": "18-27",
            "warn_high": 30,
            "critical_high": 35,
            "unit": "celsius",
        },
        "soil_temperature": {
            "critical_low": 10,
            "warn_low": 15,
            "optimal": "18-27",
            "warn_high": 28,
            "critical_high": 32,
            "unit": "celsius",
        },
        "humidity": {
            "critical_low": 30,
            "warn_low": 40,
            "optimal": "60-80",
            "unit": "%",
        },
        "light_intensity_lux": {
            "critical_low": 100,
            "warn_low": 200,
            "optimal": "400-800",
            "unit": "lux",
        },
        "soil_ph": {
            "optimal": "5.5-7.0",
        },
    },
    "source": "数据库中没有标准数据，因此使用代码内置默认标准。",
}


# ============================================================
# 2. PostgreSQL 辅助函数
# ============================================================


def safe_identifier(name: str) -> str:
    """安全地包装 SQL 标识符，例如表名和列名。"""
    if not name:
        raise ValueError("SQL 标识符为空。")

    allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_")
    if any(ch not in allowed for ch in name):
        raise ValueError(f"不安全的 SQL 标识符: {name}")

    return f'"{name}"'


class Database:
    """简单的数据库连接包装类，同时支持 psycopg v3 和 psycopg2。"""

    def __init__(self) -> None:
        self.driver = None
        self.connection = None

    def __enter__(self) -> "Database":
        database_url = os.getenv("DATABASE_URL")

        try:
            import psycopg
            from psycopg.rows import dict_row

            self.driver = "psycopg"
            if database_url:
                self.connection = psycopg.connect(database_url, row_factory=dict_row)
            else:
                self.connection = psycopg.connect(
                    host=os.getenv("PGHOST"),
                    port=os.getenv("PGPORT", "5432"),
                    dbname=os.getenv("PGDATABASE"),
                    user=os.getenv("PGUSER"),
                    password=os.getenv("PGPASSWORD"),
                    sslmode=os.getenv("PGSSLMODE", "require"),
                    row_factory=dict_row,
                )
            return self
        except ImportError:
            pass

        try:
            import psycopg2
            import psycopg2.extras

            self.driver = "psycopg2"
            if database_url:
                self.connection = psycopg2.connect(database_url)
            else:
                self.connection = psycopg2.connect(
                    host=os.getenv("PGHOST"),
                    port=os.getenv("PGPORT", "5432"),
                    dbname=os.getenv("PGDATABASE"),
                    user=os.getenv("PGUSER"),
                    password=os.getenv("PGPASSWORD"),
                    sslmode=os.getenv("PGSSLMODE", "require"),
                )
            return self
        except ImportError as exc:
            raise ImportError(
                "PostgreSQL 连接库没有安装。请运行: pip install psycopg2-binary"
            ) from exc

    def __exit__(self, exc_type, exc, tb) -> None:
        if self.connection is not None:
            self.connection.close()

    def rollback(self) -> None:
        if self.connection is not None:
            self.connection.rollback()

    def fetch_one(self, sql: str, params: Iterable[Any] = ()) -> Optional[Dict[str, Any]]:
        """执行查询并返回第一行结果。"""
        if self.connection is None:
            raise RuntimeError("数据库连接尚未打开。")

        if self.driver == "psycopg":
            with self.connection.cursor() as cur:
                cur.execute(sql, tuple(params))
                row = cur.fetchone()
                return dict(row) if row else None

        import psycopg2.extras

        with self.connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, tuple(params))
            row = cur.fetchone()
            return dict(row) if row else None


# ============================================================
# 3. 从 PostgreSQL 读取数据
# ============================================================


def normalize_for_json(value: Any) -> Any:
    """把数据库返回的数据转换成可以写入 JSON 的普通 Python 数据。"""
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {str(k): normalize_for_json(v) for k, v in value.items()}
    if isinstance(value, list):
        return [normalize_for_json(v) for v in value]
    return value


def normalize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    """把数据库的一行数据整体转换成 JSON 安全格式。"""
    return {str(k): normalize_for_json(v) for k, v in row.items()}


def load_latest_sensor_data(db: Database) -> Dict[str, Any]:
    """从 PostgreSQL 读取最新一条植物传感器/状态数据。"""
    table = safe_identifier(SENSOR_TABLE)

    where_sql = ""
    params = []
    if SENSOR_PLANT_ID_COLUMN and PLANT_ID:
        where_sql = f"WHERE {safe_identifier(SENSOR_PLANT_ID_COLUMN)} = %s"
        params.append(PLANT_ID)

    errors = []
    for order_column in SENSOR_ORDER_COLUMNS:
        sql = f"SELECT * FROM {table} {where_sql} ORDER BY {safe_identifier(order_column)} DESC LIMIT 1"
        try:
            row = db.fetch_one(sql, params)
            if row:
                return normalize_row(row)
        except Exception as exc:
            db.rollback()
            errors.append(f"{order_column}: {exc}")

    raise RuntimeError(
        "无法从 PostgreSQL 读取最新植物数据。"
        f"已尝试排序列: {SENSOR_ORDER_COLUMNS}. 错误: {errors}"
    )


def load_plant_standards(db: Database) -> Dict[str, Any]:
    """从 PostgreSQL 读取植物标准；如果没有数据，则使用 DEFAULT_PLANT_STANDARDS。"""
    table = safe_identifier(STANDARDS_TABLE)

    sql = f"SELECT * FROM {table} WHERE {safe_identifier(STANDARDS_PLANT_ID_COLUMN)} = %s LIMIT 1"
    try:
        row = db.fetch_one(sql, (PLANT_ID,))
    except Exception as exc:
        db.rollback()
        print(f"无法从 PostgreSQL 读取植物标准。将使用默认标准。错误: {exc}")
        return DEFAULT_PLANT_STANDARDS

    if not row:
        return DEFAULT_PLANT_STANDARDS

    row = normalize_row(row)

    # 常见数据库设计 1：有一个 json/jsonb 列，列名叫 care_standards 或 standards。
    # 常见数据库设计 2：整行的每个列本身就是标准数据的一部分。
    if isinstance(row.get("care_standards"), dict):
        standards = dict(row)
        standards.setdefault("source", "PostgreSQL plant standards table")
        return standards

    if isinstance(row.get("standards"), dict):
        standards = dict(row["standards"])
        standards.setdefault("plant_id", row.get("plant_id", PLANT_ID))
        standards.setdefault("source", "PostgreSQL plant standards table")
        return standards

    row.setdefault("source", "PostgreSQL plant standards table")
    return row


# ============================================================
# 4. Gemini API 相关函数
# ============================================================


def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """从 Gemini 返回文本中提取 JSON。"""
    if not text:
        return None

    cleaned = text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.removeprefix("```json").strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```").strip()
    if cleaned.endswith("```"):
        cleaned = cleaned.removesuffix("```").strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(cleaned[start : end + 1])
        except json.JSONDecodeError:
            return None

    return None


def build_gemini_prompt(plant_standards: Dict[str, Any], sensor_data: Dict[str, Any]) -> str:
    """构建发送给 Gemini 的提示词。这里不加入任何本地规则判断结果。"""
    return f"""
You are a plant health analyst for a student ICT English project.

Analyze the plant condition using ONLY the provided plant care standards and the latest sensor data.
Do not invent new standards.
Do not use any status words except these five final statuses:
- Bad
- Slightly Bad
- Normal
- Slightly Good
- Good

Meaning of the five statuses:
- Bad: clearly unhealthy or needs urgent care.
- Slightly Bad: slightly outside the healthy range and needs attention.
- Normal: mostly within the normal healthy range.
- Slightly Good: a little better than normal, close to optimal.
- Good: very healthy, values are close to the ideal range.

Plant care standards:
{json.dumps(plant_standards, ensure_ascii=False, indent=2)}

Latest sensor data from PostgreSQL:
{json.dumps(sensor_data, ensure_ascii=False, indent=2)}

Return ONLY valid JSON. Do not use Markdown.
The JSON must have exactly these keys:
{{
  "status": "Bad | Slightly Bad | Normal | Slightly Good | Good",
  "condition": "short condition label in English, for example LOW_HUMIDITY",
  "severity": "low | medium | high",
  "reason": "brief reason in simple English",
  "recommended_action": "brief action in simple English",
  "plant_message": "one short first-person message as if the plant is speaking, in simple English"
}}
""".strip()


def call_gemini(plant_standards: Dict[str, Any], sensor_data: Dict[str, Any]) -> Dict[str, Any]:
    """调用 Gemini 进行分析。本版本不使用本地判断 fallback。"""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("没有设置 GEMINI_API_KEY 或 GOOGLE_API_KEY。")

    try:
        from google import genai
    except ImportError as exc:
        raise ImportError("Gemini 库没有安装。请运行: pip install google-genai") from exc

    prompt = build_gemini_prompt(plant_standards=plant_standards, sensor_data=sensor_data)
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    result = extract_json_from_text(response.text)

    if result is None:
        raise ValueError(f"Gemini 返回内容不是合法 JSON: {response.text}")

    status = result.get("status")
    if status not in FINAL_STATUS_VALUES:
        raise ValueError(f"Gemini 返回了不支持的状态: {status}")

    result["source"] = "gemini"
    result["model"] = GEMINI_MODEL
    result["sensor_data"] = sensor_data
    result["plant_standards"] = plant_standards
    return result


# ============================================================
# 5. 输出函数
# ============================================================


def save_output(result: Dict[str, Any], output_path: Path) -> None:
    """把最终结果保存成 JSON，方便 Web Dashboard 读取。"""
    final_output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        **result,
    }

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(final_output, f, ensure_ascii=False, indent=2)


def print_result(result: Dict[str, Any]) -> None:
    """把最终分析结果打印到控制台，方便课堂展示和调试。"""
    print("=" * 50)
    print("Plant AI Management System")
    print("=" * 50)
    print(f"Source: {result.get('source')}")
    print(f"Model: {result.get('model')}")
    print(f"Status: {result.get('status')}")
    print(f"Condition: {result.get('condition')}")
    print(f"Severity: {result.get('severity')}")
    print(f"Reason: {result.get('reason')}")
    print(f"Recommended action: {result.get('recommended_action')}")
    print(f"Plant message: {result.get('plant_message')}")
    print("=" * 50)
    print(f"JSON output saved to: {OUTPUT_JSON}")


# ============================================================
# 6. 主程序入口
# ============================================================


def main() -> None:
    """
    主流程：
    1. 连接云端 PostgreSQL。
    2. 读取最新植物传感器/状态数据。
    3. 从 PostgreSQL 读取植物健康标准。
    4. 如果数据库中没有标准数据，就使用 DEFAULT_PLANT_STANDARDS。
    5. 调用 Gemini，将最终状态分类为五种状态之一。
    6. 保存并打印分析结果。
    """
    with Database() as db:
        sensor_data = load_latest_sensor_data(db)
        plant_standards = load_plant_standards(db)

    result = call_gemini(plant_standards=plant_standards, sensor_data=sensor_data)
    save_output(result, OUTPUT_JSON)
    print_result(result)


if __name__ == "__main__":
    main()
