"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/moving-border";

const uploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
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
            onClick={() => console.log(files)}
          >
            Upload
          </Button>
        </div>
      </motion.h1>
    </LampContainer>
  );
};

export default uploadPage;
