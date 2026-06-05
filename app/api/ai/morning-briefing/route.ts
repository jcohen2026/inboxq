import { NextResponse } from "next/server";
import { generateMorningBriefing } from "@/lib/ai";
import { getDemoContext } from "@/lib/demo-data";

export async function GET() {
  const context = getDemoContext();
  const briefing = await generateMorningBriefing(context);

  return NextResponse.json({
    briefing,
    mode: process.env.OPENAI_API_KEY ? "openai" : "demo"
  });
}
