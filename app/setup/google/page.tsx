import { GoogleEnvForm } from "@/components/setup/google-env-form";
import { PageHeading } from "@/components/page-heading";

export const dynamic = "force-dynamic";

export default function GoogleSetupPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";
  const defaultRedirectUri = process.env.GOOGLE_REDIRECT_URI || `${appUrl}/api/auth/google/callback`;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="Setup" title="Connect real Google accounts">
        Save your local Google OAuth keys, restart the app, then connect Gmail and Calendar from Settings.
      </PageHeading>

      <GoogleEnvForm
        defaultRedirectUri={defaultRedirectUri}
        configured={{
          clientId: Boolean(process.env.GOOGLE_CLIENT_ID),
          clientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
          redirectUri: Boolean(process.env.GOOGLE_REDIRECT_URI)
        }}
      />
    </div>
  );
}
