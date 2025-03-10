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
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  education?: { degree: string; institution: string; year: string }[];
  workExperience?: { company: string; position: string; duration: string }[];
  certifications?: string[];
  experienceLevel: string;
  keyword: string;
  location: string;
};
