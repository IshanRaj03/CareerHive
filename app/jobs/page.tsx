"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import axios from "axios";
import { useUserState } from "@/lib/state";
import { SimilarJob } from "@/lib/types";
import { ArrowLeftCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const JobsPage = () => {
  const [jobs, setJobs] = useState<SimilarJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { namespaceID, submissionId, userName } = useUserState();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      if (!namespaceID || !submissionId) return;

      try {
        const res = await axios.post<{ similarJobs: SimilarJob[] }>(
          "/api/jobs",
          {
            namespaceID,
            submissionId,
            userName,
          }
        );

        if (res.status === 200) {
          // console.log("Jobs:", res.data);
          setJobs(res.data.similarJobs);
          // console.log("setJobs:", jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarJobs();
  }, [namespaceID, submissionId, userName]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const calculateAgoTime = (dateString: string) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - postedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (diffDays < 0) return "Recently";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > 3) {
        pageNumbers.push(1);
        if (currentPage > 4) {
          pageNumbers.push("...");
        }
      }

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(maxPagesToShow - 1, totalPages);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(1, totalPages - maxPagesToShow + 2);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 750 }}
        whileInView={{ opacity: 1, y: 220 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-10 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent text-base md:text-xl rounded-xl"
      >
        <div className="w-full mt-20 px-4 py-12 bg-gray-900 min-h-screen rounded-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="text-center md:text-left px-3">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-100">
                  Recommended Jobs
                </h1>
                <p className="text-gray-400 mt-2">
                  Based on your profile and experience
                </p>
              </div>

              <button
                onClick={() => router.push("/upload")}
                className="flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 border border-gray-600 rounded-lg hover:border-blue-400"
              >
                <ArrowLeftCircle className="h-5 w-5" />
                Back to Upload
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 bg-opacity-20 mb-4"></div>
                  <div className="text-lg text-gray-400">Fetching jobs...</div>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                  {currentJobs.map((job, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/20 hover:shadow-xl transition-all duration-300 border border-gray-700 flex flex-col"
                    >
                      <div className="p-6 flex flex-col h-full">
                        {/* Job header with better alignment */}
                        <div className="mb-4">
                          <div className="flex items-start gap-4">
                            {/* Company logo */}
                            <div className="h-12 w-12 flex-shrink-0 bg-gray-700 rounded-md overflow-hidden">
                              {job.companyLogo ? (
                                <Image
                                  src={job.companyLogo}
                                  alt={`${job.company} logo`}
                                  fill
                                  sizes="48px"
                                  className="object-contain"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-700 text-gray-500">
                                  {job.company?.charAt(0) || "C"}
                                </div>
                              )}
                            </div>

                            {/* Job details - everything aligned to the start */}
                            <div className="flex flex-col items-start gap-1">
                              <h2 className="text-xl text-left font-bold text-gray-100">
                                {job.position}
                              </h2>
                              <span className="text-base text-gray-300 md:text-lg">
                                {job.company}
                              </span>
                              <span className="text-sm md:text-base text-gray-400">
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 mt-auto">
                          <div className="flex items-center text-gray-300 gap-2 mb-2">
                            <span className="text-gray-400">Salary:</span>
                            <span className="font-medium line-clamp-1">
                              {job.salary === "Not specified"
                                ? "Salary not disclosed"
                                : job.salary}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <span>
                              {job.agoTime || calculateAgoTime(job.date)} •
                              Posted on{" "}
                              {new Date(job.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end items-center mt-auto">
                          <button
                            className="bg-blue-600 hover:bg-blue-500 text-gray-100 py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                            onClick={() => window.open(job.jobUrl, "_blank")}
                          >
                            View Job
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-10 mb-4">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number" && goToPage(page)
                          }
                          className={`px-3 py-1 rounded-md ${
                            page === currentPage
                              ? "bg-blue-600 text-white"
                              : page === "..."
                              ? "text-gray-400 cursor-default"
                              : "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800 rounded-xl p-10 shadow text-center border border-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-200 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-400">
                  Try uploading a different resume or adjusting your search
                  criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.h1>
    </LampContainer>
  );
};

export default JobsPage;
