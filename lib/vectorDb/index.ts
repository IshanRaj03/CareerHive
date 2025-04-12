import { ResumeSummary } from "@/lib/types";
import { TaskType } from "@google/generative-ai";
import { pc } from "@/lib/db";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { JobsDB, JobDb } from "../types";
import { updatePineConeId } from "@/lib/database/index";

export async function createResumeEmbedding(resume: ResumeSummary) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const response = await embeddings.embedQuery(JSON.stringify(resume));
    if (!response) {
      console.log("Failed to generate embeddings.");
    }
    // console.log("Embeddings:", response);
    return response;
  } catch (error) {
    console.error("Error generating embeddings:", error);
  }
}

async function createJobEmbedding(job: JobDb) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const requiredfields = {
      position: job.position,
      company: job.company,
      location: job.location,
      // description: job.description,
    };
    const response = await embeddings.embedQuery(
      JSON.stringify(requiredfields)
    );

    if (!response) {
      console.log("Failed to generate embeddings.");
    }
    // console.log("Embeddings:", response);
    return response;
  } catch (error) {
    console.log("Error generating embeddings:", error);
  }
}

export async function createPineCone(
  resumeEmbeddings: number[],
  resume: ResumeSummary,
  name: string,
  jobs: JobsDB
) {
  try {
    const indexName = "resume-jobs-careerhive";

    const checkIndex = await pc.listIndexes();
    const indexExists = checkIndex.indexes?.some((i) => i.name === indexName);

    if (!indexExists) {
      console.log(`Creating Pinecone index: ${indexName}...`);
      await pc.createIndex({
        name: indexName,
        dimension: 768,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      let isReady = false;
      while (!isReady) {
        console.log("Waiting for Pinecone index to be ready...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const updatedIndexes = await pc.listIndexes();
        isReady = updatedIndexes.indexes
          ? updatedIndexes.indexes.some((i) => i.name === indexName)
          : false;
      }
      console.log("Pinecone index is ready!");
    }

    const index = pc.Index(indexName);
    const sanitizedResumeName = name.replace(/\s+/g, "-").toLowerCase();
    const namespaceID = `resume-jobs-${sanitizedResumeName}`;

    try {
      console.log(
        `Deleting embeddings older than a day in namespace: ${namespaceID}...`
      );
      const oneDaysAgo = Date.now() - 24 * 60 * 60 * 1000;

      // Fetch metadata to identify old embeddings
      const namespaceData = await index.fetch(["*"]);
      const oldVectorIds = Object.entries(namespaceData.records)
        .filter(([, record]) => {
          const timestamp = Number(record.metadata?.timestamp);
          return !isNaN(timestamp) && timestamp < oneDaysAgo;
        })
        .map(([id]) => id);

      if (oldVectorIds.length > 0) {
        await index.namespace(namespaceID).deleteMany(oldVectorIds);
        console.log(`Deleted ${oldVectorIds.length} old embeddings.`);
      } else {
        console.log("No old embeddings found.");
      }
    } catch (error) {
      console.error("Error deleting old embeddings:", error);
    }

    const submissionId = Math.floor(Math.random() * 100000000);
    const vectorResumeId = `${submissionId}-${sanitizedResumeName}`;

    try {
      console.log("Saving resume embeddings...");
      await index.namespace(namespaceID).upsert([
        {
          id: vectorResumeId,
          values: resumeEmbeddings,
          metadata: {
            resume: JSON.stringify(resume),
            timestamp: Date.now(),
            submissionId: submissionId,
            type: "resume",
          },
        },
      ]);
      console.log("Resume embeddings saved successfully.");
    } catch (error) {
      console.error("Error saving resume embeddings:", error);
      return;
    }

    try {
      console.log("Saving job embeddings...");
      for (const job of jobs) {
        const vectorJobId = `${submissionId}-${job.id}`;
        await updatePineConeId(job.id, vectorJobId);
        const embeddings = await createJobEmbedding(job);

        if (embeddings) {
          await index.namespace(namespaceID).upsert([
            {
              id: vectorJobId,
              values: embeddings,
              metadata: {
                job: JSON.stringify(job),
                timestamp: Date.now(),
                submissionId: submissionId,
                type: "job",
              },
            },
          ]);
        } else {
          console.error(`Failed to create embeddings for job ${job.id}`);
        }
      }
      console.log("Job embeddings saved successfully.");
    } catch (error) {
      console.error("Error saving job embeddings:", error);
    }
    return {
      namespaceID,
      submissionId,
    };
  } catch (error) {
    console.error("Unexpected error in createPineCone:", error);
  }
}
