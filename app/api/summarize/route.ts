import { ChatOpenAI } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";

import {
  ResumeSummary,
  extractTextFromPDF,
  summarizeText,
} from "@/lib/summarization/index";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const text = await extractTextFromPDF(data);

  const summary: ResumeSummary = await summarizeText(text);
  console.log("Resume Summary:", summary);
  return NextResponse.json({ message: "File uploaded successfully." });
}
