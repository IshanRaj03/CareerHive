import prisma from "@/lib/db";

import { Jobs } from "@/lib/types";

export async function updatePineConeId(id: string, pineconeId: string) {
  try {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        pineconeId,
      },
    });
  } catch (error) {
    console.error("Error updating PineCone ID:", error);
  }
}
export async function fetchJobsByIds(ids: string[]) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs by IDs:", error);
  }
}

export async function createJob(jobs: Jobs, resumeId: number) {
  const userId = JSON.stringify(resumeId);
  jobs.map(async (job) => {
    try {
      const j = await prisma.job.findMany({
        where: {
          jobUrl: job.jobUrl,
          userid: userId,
        },
      });
      if (j.length === 0) {
        await prisma.job.create({
          data: {
            userid: userId,
            position: job.position,
            company: job.company,
            companyLogo: job.companyLogo,
            location: job.location,
            jobPostedDate: job.date,
            jobAgoTime: job.agoTime,
            salary: job.salary,
            jobUrl: job.jobUrl,
          },
        });
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  });
}

export async function removeJob(id: string) {
  try {
    await prisma.job.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting job:", error);
  }
}

export async function removeOldJobs() {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 5);

    const dateThresholdString = dateThreshold.toISOString().split("T")[0];

    const oldJobs = await prisma.job.findMany({
      where: {
        jobPostedDate: {
          lt: dateThresholdString,
        },
      },
      select: {
        id: true,
      },
    });

    for (const job of oldJobs) {
      if (!job.id) continue; // Skip if ID is missing
      try {
        await prisma.job.delete({
          where: {
            id: job.id,
          },
        });
      } catch (error) {
        console.error(`Error deleting job with ID ${job.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching old jobs:", error);
  }
}

export async function getJobs(resumeId: number) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        userid: JSON.stringify(resumeId),
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}
