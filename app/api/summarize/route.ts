import { NextRequest, NextResponse } from "next/server";
import {
  fetchjobswithlocation,
  fetchjobswithoutlocation,
} from "@/lib/fetchJobs/index";

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

  const fetchJobsWithLocation = await fetchjobswithlocation({
    keyword: summary.keyword,
    experienceLevel: summary.experienceLevel,
    location: summary.location,
  });

  const fetchJobsWithoutLocation = await fetchjobswithoutlocation({
    keyword: summary.keyword,
    experienceLevel: summary.experienceLevel,
  });

  const jobs = [
    ...(fetchJobsWithLocation || []),
    ...(fetchJobsWithoutLocation || []),
  ];

  console.log("Jobs:", jobs);

  return NextResponse.json({
    message: "Your Resume is successfully precessed",
  });
}
