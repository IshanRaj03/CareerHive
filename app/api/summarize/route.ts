import { NextRequest, NextResponse } from "next/server";
import {
  fetchjobswithlocation,
  fetchjobswithoutlocation,
} from "@/lib/fetchJobs/index";
import { createJob, removeOldJobs } from "@/lib/database/index";

import {
  ResumeSummary,
  extractTextFromPDF,
  summarizeText,
} from "@/lib/summarization/index";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  try {
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

    await removeOldJobs();
    await createJob(jobs);
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing the resume.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Your Resume is successfully precessed",
  });
}
