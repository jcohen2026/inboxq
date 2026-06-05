import { PageHeading } from "@/components/page-heading";
import { SupabaseEnvForm } from "@/components/setup/supabase-env-form";

export const dynamic = "force-dynamic";

export default function SupabaseSetupPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="Setup" title="Connect Supabase">
        Save your Supabase keys locally. The service role key is used only on the server for private beta setup and sync jobs.
      </PageHeading>

      <SupabaseEnvForm
        defaults={{
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        }}
        configured={{
          supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          anonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          serviceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
        }}
      />
    </div>
  );
}
