import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // These will be wired via .env; we avoid throwing on the client to keep
  // static pages working even before configuration is complete.
  // eslint-disable-next-line no-console
  console.warn("Supabase client is not fully configured.");
}

export const supabaseBrowserClient =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;

