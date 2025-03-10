"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/moving-border";
import axios from "axios";
import { useUserState } from "@/lib/state";

// What to do next
// sort out the params and the router things
// do vector embedding of the resume in the summarization and send the pinecone id also as params to the jobs page

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    setUserName,
    setParametersForSimilarity,
    userName,
    namespaceID,
    submissionId,
  } = useUserState();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const file = files[0];

    try {
      setIsLoading(true);

      const data = new FormData();
      data.set("file", file);

      const res = await axios.post<{
        name: string;
        message: string;
        namespaceID: string;
        submissionId: number;
      }>("/api/summarize", data);

      if (res.status === 200) {
        const data = res.data;
        setUserName(data.name || "User");
        setParametersForSimilarity(data.namespaceID, data.submissionId);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error preparing file:", err);
      setIsLoading(false);
    }
  };

  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 750 }}
        whileInView={{ opacity: 1, y: 220 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-10 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl rounded-xl"
      >
        <div className="text-white w-full mx-auto p-5 min-h-96 border border-dashed bg-black border-neutral-800 rounded-xl">
          <FileUpload onChange={handleFileUpload} />
          <Button
            borderRadius="1.75rem"
            className=" bg-black text-xl text-white border-neutral-800 "
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? "Processing your resume....." : "Upload"}
          </Button>
        </div>
      </motion.h1>
    </LampContainer>
  );
};

export default UploadPage;
