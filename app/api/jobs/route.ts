import { NextResponse } from "next/server";
import { pc } from "@/lib/db";
import { fetchJobsByIds } from "@/lib/database/index";
import { SimilarJob } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { namespaceID, submissionId, userName } = await req.json();
    if (!namespaceID || !submissionId || !userName) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const indexName = "resume-jobs-careerhive";
    const index = pc.Index(indexName);

    // Construct the resume vector ID

    const resumeVectorId = `${submissionId}-${userName
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    // Retrieve the resume embedding from Pinecone
    const fetchResult = await index
      .namespace(namespaceID)
      .fetch([resumeVectorId]);

    // console.log(namespaceID, resumeVectorId, fetchResult);

    if (!fetchResult.records || !fetchResult.records[resumeVectorId]) {
      return NextResponse.json(
        { error: "Resume embedding not found" },
        { status: 404 }
      );
    }

    const resumeEmbedding = fetchResult.records[resumeVectorId].values;

    const maxAttempts = 10;
    const delay = 2000;
    let attempts = 0;
    let queryResult;

    while (attempts < maxAttempts) {
      queryResult = await index.namespace(namespaceID).query({
        topK: 20,
        includeMetadata: true,
        vector: resumeEmbedding,
        filter: {
          $and: [
            { type: { $eq: "job" } },
            { submissionId: { $eq: submissionId } },
          ],
        },
      });
      if (queryResult.matches && queryResult.matches.length > 0) {
        break;
      }
      attempts++;
      console.log(`Polling attempt ${attempts}: No matches found.`);

      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }

    // // Query Pinecone for similar jobs using the retrieved embedding
    // const queryResult = await index.namespace(namespaceID).query({
    //   topK: 20,
    //   includeMetadata: true,
    //   vector: resumeEmbedding,
    //   filter: {
    //     $and: [
    //       { type: { $eq: "job" } },
    //       { submissionId: { $eq: submissionId } },
    //     ],
    //   },
    // });
    console.log("Query result:", queryResult);

    if (
      !queryResult ||
      !queryResult.matches ||
      queryResult.matches.length === 0
    ) {
      return NextResponse.json({ jobs: [] });
    }

    const jobIds = queryResult.matches
      .map((match) => {
        try {
          if (match.metadata && typeof match.metadata.job === "string") {
            const jobMetadata = JSON.parse(match.metadata.job);
            return jobMetadata.id;
          } else {
            console.error("Invalid or missing job metadata:", match.metadata);
            return null;
          }
        } catch (error) {
          console.error("Error parsing job metadata:", error);
          return null;
        }
      })
      .filter((id): id is string => id !== null);

    console.log("Job IDs:", jobIds);
    // Fetch job details from PostgreSQL
    const jobs = await fetchJobsByIds(jobIds);

    const similarJobs: SimilarJob[] = (jobs || [])
      .map((job) => ({
        id: job.id,
        position: job.position,
        company: job.company,
        location: job.location,
        date: job.jobPostedDate,
        agoTime: job.jobAgoTime,
        salary: job.salary || "Salary not disclosed",
        jobUrl: job.jobUrl,
        companyLogo: job.companyLogo || "",
        description: job.description || "",
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date (most recent first)

    return NextResponse.json({ similarJobs });
  } catch (error) {
    console.error("Error fetching similar jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
