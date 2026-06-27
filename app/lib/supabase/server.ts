import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const missingEnvMessage =
    "Missing server-only Supabase environment variables. Set SUPABASE_URL and SUPABASE_SECRET_KEY, or set KONOHA_USE_MOCK_FALLBACK=true for local development without Supabase.";

let cachedClient: SupabaseClient | null = null;

export function hasSupabaseServerEnv() {
    return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export function isMockFallbackEnabled() {
    return process.env.KONOHA_USE_MOCK_FALLBACK === "true";
}

export function getMissingSupabaseEnvMessage() {
    return missingEnvMessage;
}

export function getDefaultDeviceId() {
    return process.env.KONOHA_DEFAULT_DEVICE_ID?.trim() || "konoha-esp32-01";
}

export function getSupabaseServerClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
        throw new Error(missingEnvMessage);
    }

    if (!cachedClient) {
        cachedClient = createClient(supabaseUrl, supabaseSecretKey, {
            auth: {
                autoRefreshToken: false,
                detectSessionInUrl: false,
                persistSession: false,
            },
        });
    }

    return cachedClient;
}
