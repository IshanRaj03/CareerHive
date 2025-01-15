import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";

export default function Home() {
  const words = `CareerHive uses AI to deliver personalized job recommendations
            tailored to your skills and experience. Upload your resume and
            discover opportunities that fit your career goals.`;

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-black">
      <div className="grid grid-cols-2 m-20">
        <div className="">
          <h2 className="bg-clip-text text-transparent text-center bg-gray-300 from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-1 md:py-5 relative z-20 font-bold tracking-tight">
            CareerHive
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-lg text-neutral-400 dark:text-neutral-400 text-center">
            Find Jobs Faster, Smarter, and Hassle-Free
          </p>
        </div>
        <div className="m-auto max-w-xl">
          <TextGenerateEffect words={words} />
        </div>
      </div>
      <div className="">
        <Link href="/upload">
          <Button
            borderRadius="1.75rem"
            className=" bg-black dark:bg-slate-900 text-xl text-white dark:text-white border-neutral-600 dark:border-slate-800"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </BackgroundLines>
  );
}
