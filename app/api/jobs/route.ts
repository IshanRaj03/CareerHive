import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        salary: data.salary,
        jobType: data.jobType,
        experienceLevel: data.experienceLevel,
        jobUrl: data.jobUrl,
      },
    });

    return NextResponse.json({
      message: "Job created successfully.",
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating the job.",
      },
      { status: 500 }
    );
  }
}
