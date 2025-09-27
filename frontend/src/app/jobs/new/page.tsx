"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/job/JobForm";
import { CreateJobRequest } from "@/types";

// Mock API function - will be replaced with real API call
const createJob = async (jobData: CreateJobRequest): Promise<{ id: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, this would make an API call
  const jobId = `job_${Date.now()}`;

  return { id: jobId };
};

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [createdJobId, setCreatedJobId] = React.useState<string | null>(null);

  const handleJobSubmit = async (data: CreateJobRequest) => {
    setIsSubmitting(true);

    try {
      const result = await createJob(data);
      setCreatedJobId(result.id);
      setIsSuccess(true);

      // Redirect to job details page after a short delay
      setTimeout(() => {
        router.push(`/jobs/${result.id}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to create job:", error);
      // In a real app, show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (isSuccess && createdJobId) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold">Job Created Successfully!</h1>
              <p className="text-muted-foreground mt-2">
                Your PubMed scraping job has been created and will start processing shortly.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Job ID: <span className="font-mono font-medium">{createdJobId}</span>
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href={`/jobs/${createdJobId}`}>
                <Button>
                  View Job Details
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Redirecting to job details in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-6 hover-lift">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gradient">
              Create Research Job
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Configure your PubMed search parameters and let our system automatically 
              discover and download relevant research papers
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Job Form */}
          <div className="xl:col-span-2">
            <JobForm
              onSubmit={handleJobSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Sidebar with Help */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="card-elevated p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <span className="text-sm font-semibold">💡</span>
                </div>
                <h3 className="font-semibold text-lg">Quick Tips</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Search Syntax</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use quotes for exact phrases</li>
                    <li>• Add [tiab] for title/abstract search</li>
                    <li>• Use AND, OR, NOT operators</li>
                    <li>• Wildcards with * (e.g., cardi*)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Best Practices</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Start with 50-100 results for testing</li>
                    <li>• Use PMC-only for open access</li>
                    <li>• Enable external sources for more coverage</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Example Queries */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>📚</span>
                Example Queries
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: "Cardiology Research",
                    query: '("atrial fibrillation"[tiab]) AND (treatment[tiab])',
                    description: "Find articles about atrial fibrillation treatment"
                  },
                  {
                    title: "Cancer Studies",
                    query: '("breast cancer"[tiab]) AND ("clinical trial"[pt])',
                    description: "Clinical trials for breast cancer"
                  },
                  {
                    title: "Neuroscience",
                    query: '("alzheimer*"[tiab]) AND (biomarker*[tiab])',
                    description: "Alzheimer's disease biomarker research"
                  }
                ].map((example, index) => (
                  <div key={index} className="p-3 border border-border/50 rounded-lg hover:border-border transition-colors">
                    <h4 className="font-medium text-sm mb-1">{example.title}</h4>
                    <code className="text-xs bg-muted/50 p-1 rounded block mb-2 text-foreground">
                      {example.query}
                    </code>
                    <p className="text-xs text-muted-foreground">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
