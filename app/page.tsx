"use client";
import React, { useState, useEffect } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Target,
  Clock,
  Award,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const words = `CareerHive uses AI to deliver personalized job recommendations
            tailored to your skills and experience. Upload your resume and
            discover opportunities that fit your career goals.`;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Optional: Add scroll listener for additional animations
    const handleScroll = () => {
      // You can add scroll-based animations here
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section */}
      <BackgroundLines className="flex items-center justify-center w-full flex-col h-[100vh] px-4 bg-black">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid md:grid-cols-2 grid-cols-1 m-8 md:m-20 gap-8">
            <div className="">
              <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-r from-indigo-400 via-gray-300 to-indigo-400 text-2xl md:text-4xl lg:text-7xl font-sans py-1 md:py-5 relative z-20 font-bold tracking-tight">
                CareerHive
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-lg text-neutral-400 dark:text-neutral-400 text-center">
                Find Jobs Faster, Smarter, and Hassle-Free
              </p>
            </div>
            <div className="m-auto text-sm text-center md:text-left md:text-lg lg:text-xl max-w-xl">
              <TextGenerateEffect words={words} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/upload">
              <Button
                borderRadius="1.75rem"
                className="bg-black dark:bg-slate-900 text-lg md:text-xl text-white dark:text-white border-neutral-600 dark:border-slate-800 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => {
                const featuresElement = document.getElementById("features");
                if (featuresElement) {
                  featuresElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-gray-400 hover:text-white flex flex-col items-center transition-colors"
            >
              <span className="mb-2">Scroll to explore</span>
              <ChevronDown className="animate-bounce" />
            </button>
          </div>
        </div>
      </BackgroundLines>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
            Why Choose <span className="text-indigo-400">CareerHive</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
              <Briefcase className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                AI-Powered Matching
              </h3>
              <p className="text-gray-300">
                Our advanced algorithms analyze your skills and experience to
                find perfect job matches.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
              <Target className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-gray-300">
                Get job suggestions tailored to your career goals and
                preferences.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
              <Clock className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Save Time</h3>
              <p className="text-gray-300">
                Stop wasting hours scanning job boards. We bring the right
                opportunities to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                95%
              </p>
              <p className="text-lg text-gray-300">Match Accuracy</p>
            </div>
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                10,000+
              </p>
              <p className="text-lg text-gray-300">Success Stories</p>
            </div>
            <div className="p-6">
              <p className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                48 hrs
              </p>
              <p className="text-lg text-gray-300">
                Average Time to First Interview
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs
            through CareerHive.
          </p>
          <Link href="/upload">
            <Button
              borderRadius="1.75rem"
              className="flex items-center justify-center hover:bg-indigo-700 text-white border-indigo-500 px-4 py-4"
            >
              <div className="text-sm md:text-base ">Upload Your Resume</div>
              <ArrowRight className="ml-2 h-4 w-4 md:h-8 md:w-8" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonial Preview */}
      {/* <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-30 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
            <div className="mb-6">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-xl text-gray-200 italic mb-6">
                "CareerHive completely changed my job search experience. Within
                two weeks, I had three interviews with companies that perfectly
                matched my skills and career goals."
              </p>
              <div>
                <p className="text-lg font-semibold text-white">
                  Sarah Johnson
                </p>
                <p className="text-gray-400">Software Engineer</p>
              </div>
            </div>
            <Link href="/testimonials">
              <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Read More Success Stories →
              </button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">CareerHive</h3>
              <p className="text-gray-400">
                AI-powered job matching platform for the modern professional.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Features
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/upload"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Resume Analyzer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upload"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Job Matching
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upload"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Career Insights
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} CareerHive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
