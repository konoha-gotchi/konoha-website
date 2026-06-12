"use client";

import { useState } from "react";

interface Props {
  buttonClassName?: string;
  statusClassName?: string;
}

export default function GenerateReportButton({ buttonClassName, statusClassName }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function generateReport() {
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/plant-ai-report", {
        method: "POST",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || "Could not generate message.");
      }

      setState("done");
      setMessage("New plant message saved.");
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not generate message.");
    }
  }

  return (
    <>
      <button className={buttonClassName} onClick={generateReport} disabled={state === "loading"}>
        {state === "loading" ? "Generating..." : "Generate plant message"}
      </button>
      {message ? (
        <p className={statusClassName} aria-live="polite">
          {message}
        </p>
      ) : null}
    </>
  );
}
