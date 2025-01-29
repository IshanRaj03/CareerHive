import axios from "axios";
import { input, s } from "framer-motion/client";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type ResumeSummary = {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  education?: { degree: string; institution: string; year: string }[];
  workExperience?: { company: string; position: string; duration: string }[];
  certifications?: string[];
};

// Extrxt text from PDF using Langchain PDFLoader
export async function extractTextFromPDF(formData: FormData): Promise<string> {
  try {
    const data = await formData;
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      throw new Error("Please select a file to upload.");
    }

    const loader = new PDFLoader(file);

    const docs = await loader.load();

    if (docs.length === 0) {
      throw new Error("Failed to extract text from PDF.");
    }

    const extractedText = docs.map((doc) => doc.pageContent).join("\n");

    return extractedText;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from PDF.");
  }
}

// generating summary using the hugging face models
export async function summarizeText(text: string): Promise<ResumeSummary> {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
    maxRetries: 5,
  });

  const response = await llm.invoke([
    [
      "system",
      `Extract and summarize the following details from the resume:
    - Name
    - Email
    - Phone Number
    - Skills
    - Education (degree, institution, year)
    - Work Experience (company, position, duration)
    - Certifications
    
    Resume text will be provided in the next message.
    Provide the output as structured JSON format.
    `,
    ],
    ["human", text],
  ]);

  const rawSummary = response.content as string;
  const cleanedSummary = rawSummary.replace(/```json|```/g, "").trim();

  try {
    const summary = JSON.parse(cleanedSummary); // Parse the cleaned JSON
    return summary;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Received invalid JSON from the summarization model.");
  }
}
