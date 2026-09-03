import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import dns from "node:dns";
import { isSupabaseConfigured } from "./client";

// Ensure Node.js prioritizes IPv4 over IPv6 on Windows to prevent DNS 'fetch failed' timeouts
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore if running in non-node environments
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // Can be ignored if middleware is refreshing sessions.
        }
      },
    },
  });
}

export { isSupabaseConfigured };
