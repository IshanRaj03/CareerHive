import { ChatOpenAI } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export type ResumeSummary = {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  education?: { degree: string; institution: string; year: string }[];
  workExperience?: { company: string; position: string; duration: string }[];
  certifications?: string[];
};

export async function POST(req: Request) {
  console.log("POST Request received");
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "Please select a file to upload." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    PdfParse(buffer).then((data) => {
      console.log(data.text);
    });

    return NextResponse.json({ message: "File uploaded successfully." });

    // const pdfData = await pdf(buffer);

    // if (!pdfData.text) {
    //   return NextResponse.json(
    //     { error: "Failed to extract text from the resume." },
    //     { status: 500 }
    //   );
    // }

    // const text = pdfData.text;

    // console.log("Extracted text from the resume:", text);

    //   const prompt = `
    //   Extract and summarize the following details from the resume:
    //   - Name
    //   - Email
    //   - Phone Number
    //   - Skills
    //   - Education
    //   - Work Experience
    //   - Certifications

    //   Resume Text:
    //   ${text}

    //   Provide the output in JSON format.
    //   `;

    //   const llm = new ChatOpenAI({
    //     model: "gpt-3.5-turbo",
    //     apiKey: process.env.OPENAI_API_KEY,
    //     temperature: 0,
    //   });

    //   const response = await llm.invoke([{ role: "user", content: prompt }]);

    //   const summary = JSON.parse(response.content as string);
    //   const resumeSummary: ResumeSummary = {
    //     name: summary.name,
    //     email: summary.email,
    //     phone: summary.phone,
    //     skills: summary.skills,
    //     education: summary.education,
    //     workExperience: summary.workExperience,
    //     certifications: summary.certifications,
    //   };

    //   return NextResponse.json(
    //     {
    //       message: "Resume summary generated successfully.",
    //       summary: resumeSummary,
    //     },
    //     {
    //       status: 200,
    //     }
    //   );
  } catch (error) {
    console.error("Error summarizing resume:", error);
    return NextResponse.json(
      { error: "An error occurred while summarizing the resume." },
      { status: 500 }
    );
  }
}
