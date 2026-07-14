import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para uso exclusivo en el servidor (Server Components, Route Handlers).
 * Usa la clave secreta — nunca importar este módulo desde un componente cliente.
 */
export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}
