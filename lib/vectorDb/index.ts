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
      description: job.description,
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

// export async function createPineCone(
//   resumeEmbeddings: number[],
//   resume: ResumeSummary,
//   jobs: JobsDB
// ) {
//   let checkIndex = await pc.listIndexes();
//   let index = null;
//   if (
//     !checkIndex.indexes?.findIndex((i) => i.name === "Resume-Jobs-CareerHive")
//   ) {
//     await pc.createIndex({
//       name: "Resume-Jobs-CareerHive",
//       dimension: 768,
//       metric: "cosine",
//       spec: {
//         serverless: {
//           cloud: "aws",
//           region: "us-east-1",
//         },
//       },
//     });
//     index = pc.Index("Resume-Jobs-CareerHive");
//   } else {
//     index = pc.Index("Resume-Jobs-CareerHive");
//   }

//   const randomNumber = Math.floor(Math.random() * 100000000);
//   const namespaceID = `Resume-Jobs-${resume.name}`;
//   const vectorResumeId = `${randomNumber}-${resume.name}`;

//   try {
//     console.log("Saving resume embeddings...");

//     await index.namespace(namespaceID).upsert([
//       {
//         id: vectorResumeId,
//         values: resumeEmbeddings,
//         metadata: {
//           resume: JSON.stringify(resume),
//         },
//       },
//     ]);
//     console.log("Resume embeddings saved successfully.");
//   } catch (error) {
//     console.error("Error saving resume embeddings:", error);
//   }

//   try {
//     console.log("Saving job embeddings...");

//     jobs.map(async (job) => {
//       const vectorJobId = `${randomNumber}-${job.id}`;
//       await updatePineConeId(job.id, vectorJobId);
//       const embeddings = await createJobEmbedding(job);
//       if (embeddings) {
//         await index.namespace(namespaceID).upsert([
//           {
//             id: vectorJobId,
//             values: embeddings,
//             metadata: {
//               job: JSON.stringify(job),
//             },
//           },
//         ]);
//       } else {
//         console.error("Failed to create job embeddings for job:", job);
//       }
//     });
//     console.log("Job embeddings saved successfully.");
//   } catch (error) {
//     console.error("Error saving job embeddings:", error);
//   }
// }

export async function createPineCone(
  resumeEmbeddings: number[],
  resume: ResumeSummary,
  jobs: JobsDB
) {
  try {
    const indexName = "resume-jobs-careerhive"; // ✅ Lowercase, valid name

    let checkIndex = await pc.listIndexes();
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

      // Wait until the index is ready
      let isReady = false;
      while (!isReady) {
        console.log("Waiting for Pinecone index to be ready...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        const updatedIndexes = await pc.listIndexes();
        isReady = updatedIndexes.indexes
          ? updatedIndexes.indexes.some((i) => i.name === indexName)
          : false;
      }
      console.log("✅ Pinecone index is ready!");
    }

    const index = pc.Index(indexName);

    const randomNumber = Math.floor(Math.random() * 100000000);
    const sanitizedResumeName = resume.name
      ? resume.name.replace(/\s+/g, "-").toLowerCase()
      : "unknown-resume"; // ✅ Replace spaces, lowercase
    const namespaceID = `resume-jobs-${sanitizedResumeName}`;
    const vectorResumeId = `${randomNumber}-${sanitizedResumeName}`;

    // Save Resume Embeddings
    try {
      console.log("Saving resume embeddings...");
      await index.namespace(namespaceID).upsert([
        {
          id: vectorResumeId,
          values: resumeEmbeddings,
          metadata: {
            resume: JSON.stringify(resume),
          },
        },
      ]);
      console.log("✅ Resume embeddings saved successfully.");
    } catch (error) {
      console.error("❌ Error saving resume embeddings:", error);
      return;
    }

    // Save Job Embeddings
    try {
      console.log("Saving job embeddings...");
      for (const job of jobs) {
        const vectorJobId = `${randomNumber}-${job.id}`;
        await updatePineConeId(job.id, vectorJobId);
        const embeddings = await createJobEmbedding(job);
        if (embeddings) {
          await index.namespace(namespaceID).upsert([
            {
              id: vectorJobId,
              values: embeddings,
              metadata: {
                job: JSON.stringify(job),
              },
            },
          ]);
        } else {
          console.error("❌ Failed to create job embeddings for job:", job);
        }
      }
      console.log("✅ Job embeddings saved successfully.");
    } catch (error) {
      console.error("❌ Error saving job embeddings:", error);
    }
  } catch (error) {
    console.error("❌ Unexpected error in createPineCone:", error);
  }
}
