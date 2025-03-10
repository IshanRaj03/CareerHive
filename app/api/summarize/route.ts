import { NextRequest, NextResponse } from "next/server";
import {
  fetchjobswithlocation,
  fetchjobswithoutlocation,
} from "@/lib/fetchJobs/index";
import { createJob, removeOldJobs, getJobs } from "@/lib/database/index";
import { createResumeEmbedding, createPineCone } from "@/lib/vectorDb";
import { ResumeSummary } from "@/lib/types";
import { extractTextFromPDF, summarizeText } from "@/lib/summarization/index";
import { JobsDB } from "@/lib/types";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  try {
    const text = await extractTextFromPDF(data);

    const summary: ResumeSummary = await summarizeText(text);
    // console.log("Resume Summary:", summary);

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

    const resumeId = Math.floor(Math.random() * 1000000);

    await removeOldJobs();
    await createJob(jobs, resumeId);
    const resumeEmbeddings = await createResumeEmbedding(summary);
    if (!resumeEmbeddings) {
      throw new Error("Failed to create resume embeddings");
    }

    const allJobs: JobsDB = (await getJobs(resumeId)) || [];
    await createPineCone(resumeEmbeddings, summary, allJobs);

    return NextResponse.json({
      name: summary.name,
      message: "Your Resume is successfully precessed",
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing the resume.",
      },
      { status: 500 }
    );
  }
}

// What to do next

// 1. The Embeddings are not getting stored in pinecone so work on that
// 2. Use Redis for caching the user name for the jobs page.
// 3. Build the job page after that.
// 4. Find the matching jobs for the user.
