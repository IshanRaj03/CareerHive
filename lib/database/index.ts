import prisma from "@/lib/db";
type Job = {
  position: string;
  company: string;
  companyLogo: string;
  location: string;
  date: string;
  agoTime: string;
  salary: string;
  jobUrl: string;
};
type Jobs = Job[];
export async function createJob(jobs: Jobs) {
  jobs.forEach(async (job) => {
    try {
      const j = await prisma.job.findMany({
        where: {
          jobUrl: job.jobUrl,
        },
      });
      if (!j) {
        await prisma.job.create({
          data: {
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
    dateThreshold.setDate(dateThreshold.getDate() - 30);

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

    oldJobs.forEach(async (job) => {
      try {
        await prisma.job.delete({
          where: {
            id: job.id,
          },
        });
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    });
  } catch (error) {
    console.error("Error deleting old jobs:", error);
  }
}
