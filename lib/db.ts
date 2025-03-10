import { PrismaClient } from "@prisma/client";
import { Pinecone } from "@pinecone-database/pinecone";

const prisma = new PrismaClient();

export default prisma;

export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});
