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
      experienceLevel: summary.Experience_Level,
      location: summary.location,
    });

    const fetchJobsWithoutLocation = await fetchjobswithoutlocation({
      keyword: summary.keyword,
      experienceLevel: summary.Experience_Level,
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
    const dataForSimilarity = await createPineCone(
      resumeEmbeddings,
      summary,
      summary.Name || "unknown",
      allJobs
    );

    if (!dataForSimilarity) {
      throw new Error("Failed to create data for similarity");
    }

    return NextResponse.json({
      name: summary.Name,
      namespaceID: dataForSimilarity.namespaceID,
      submissionId: dataForSimilarity.submissionId,
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
