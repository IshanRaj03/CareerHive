export type JobDb = {
  id: string;
  position: string;
  company: string;
  location: string;
  description?: string | null; // Allow null
  salary?: string | null;
  jobUrl: string;
  jobPostedDate: string;
  jobAgoTime: string;
  companyLogo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  pineconeId?: string | null;
};

export type JobsDB = JobDb[];

export type Job = {
  position: string;
  company: string;
  companyLogo: string;
  location: string;
  date: string;
  agoTime: string;
  salary: string;
  jobUrl: string;
};
export type Jobs = Job[];

export type ResumeSummary = {
  Name?: string;
  Email?: string;
  Phone?: string;
  Skills?: string[];
  Education?: { degree: string; institution: string; year: string }[];
  Work_Experience?: { company: string; position: string; duration: string }[];
  Certifications?: string[];
  Experience_Level: string;
  keyword: string;
  location: string;
};
