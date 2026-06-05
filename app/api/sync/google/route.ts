import { NextResponse } from "next/server";
import { getDemoContext } from "@/lib/demo-data";

export async function POST() {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
    const context = getDemoContext();
    return NextResponse.json({
      mode: "demo",
      syncLogs: context.syncLogs,
      message: "Demo data returned because live Google sync is not configured."
    });
  }

  return NextResponse.json(
    {
      status: "not_implemented",
      message: "Connect encrypted OAuth token storage before enabling live sync."
    },
    { status: 501 }
  );
}
