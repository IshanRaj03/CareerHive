import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { ResumeSummary } from "@/lib/types";
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
    temperature: 1,
    apiKey: process.env.GEMINI_API_KEY,
    maxRetries: 5,
  });

  const response = await llm.invoke([
    [
      "system",
      `Extract and summarize the following details from the resume:
    - Name
    - Email
    - Phone
    - Skills
    - Education (degree, institution, year)
    - Work_Experience (company, position, duration)
    - Certifications
    - Experience_Level
    - keyword
    - location
    
    The Experience Level and Location should not be null, experience level should be one of the following: internship, entry level, associate, senior, director, executive.
    
    If you find that the user who's resume you are summarizing is a student, i.e he/she is still in college in their 2nd or 3rd year, and you can get the duration of course from the degree or assume 4 years, then the experience level should be internship.
    
    Also if the experience level is not more than 1 year, then the experience level should be internship.
    
    The keyword is like the field which you need to find from the experience or the projects, like software engineering, data science,full stack developer, frontend developer, backend developer, etc., and also it should not be null.
    Also In the key word there should not be Web Developer, Web Development, Web Design, etc.
    It should be like software engineering, data science, full stack developer, frontend developer, backend developer, etc.
    
    The location should be the country of the person, you can get the location from the educational institute or the work experience, and also I should not be null.

    Resume text will be provided in the next message.
    Provide the output as structured JSON format and make sure to name the keys exactly as mentioned above.

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
