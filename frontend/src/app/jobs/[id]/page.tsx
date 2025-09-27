"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { JobProgress } from "@/components/job/JobProgress";
import { ResultsTable } from "@/components/job/ResultsTable";
import { Job, Article, JobStatus } from "@/types";

// Mock API functions - will be replaced with real API calls
const fetchJob = async (jobId: string): Promise<Job> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: jobId,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    name: "Atrial Fibrillation Research",
    query: '("atrial fibrillation"[tiab]) AND (malnutrition[tiab])',
    max_results: 50,
    date_from: "2023-01-01",
    date_to: "2024-01-01",
    pmc_only: false,
    allow_external: true,
    concurrency: 3,
    status: JobStatus.DOWNLOADING,
  };
};

const fetchJobArticles = async (jobId: string): Promise<Article[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: "art_1",
      job_id: jobId,
      pmid: "12345678",
      title: "Effects of malnutrition on atrial fibrillation outcomes in elderly patients",
      pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/12345678/",
      pmc_id: "PMC1234567",
      status: "downloaded" as any,
      retries: 0,
    },
    {
      id: "art_2",
      job_id: jobId,
      pmid: "23456789",
      title: "Malnutrition as a risk factor for atrial fibrillation: A systematic review",
      pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/23456789/",
      external_url: "https://www.journal.com/article/23456789",
      status: "resolved" as any,
      retries: 0,
    },
    {
      id: "art_3",
      job_id: jobId,
      pmid: "34567890",
      title: "Impact of nutritional status on atrial fibrillation recurrence after ablation",
      pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/34567890/",
      status: "failed_paywall" as any,
      failure_reason: "Paywall detected - requires institutional access",
      retries: 2,
    },
  ];
};

const exportJobResults = async (jobId: string, format: 'csv' | 'json'): Promise<Blob> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = `Job ID,PMID,Title,Status\n${jobId},12345678,Sample Article 1,Downloaded`;
  return new Blob([data], { type: 'text/csv' });
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = React.useState<Job | null>(null);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  const [pollingInterval, setPollingInterval] = React.useState<NodeJS.Timeout | null>(null);

  // Initial data loading
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [jobData, articlesData] = await Promise.all([
          fetchJob(jobId),
          fetchJobArticles(jobId),
        ]);
        setJob(jobData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Failed to load job data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  // Polling for real-time updates
  React.useEffect(() => {
    if (!job || job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const [jobData, articlesData] = await Promise.all([
          fetchJob(jobId),
          fetchJobArticles(jobId),
        ]);
        setJob(jobData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Failed to poll job data:", error);
      }
    }, 2000); // Poll every 2 seconds

    setPollingInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [jobId, job?.status]);

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleRetryArticle = async (articleId: string) => {
    console.log("Retrying article:", articleId);
    // In a real app, make API call to retry article
  };

  const handlePreviewArticle = (article: Article) => {
    console.log("Previewing article:", article);
    // In a real app, open preview modal or navigate to preview page
  };

  const handleDownloadArticle = async (articleId: string) => {
    console.log("Downloading article:", articleId);
    // In a real app, make API call to download specific article
  };

  const handleBulkRetry = async (articleIds: string[]) => {
    console.log("Bulk retrying articles:", articleIds);
    // In a real app, make API call to retry multiple articles
  };

  const handleBulkDownload = async (articleIds: string[]) => {
    console.log("Bulk downloading articles:", articleIds);
    // In a real app, make API call to download multiple articles
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const blob = await exportJobResults(jobId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_${jobId}_results.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested job could not be found.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isActive = job.status === JobStatus.SEARCHING ||
                   job.status === JobStatus.RESOLVING ||
                   job.status === JobStatus.DOWNLOADING;

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold">{job.name}</h1>
            <p className="text-muted-foreground">
              Job ID: <span className="font-mono">{job.id}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isActive && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting || articles.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            disabled={isExporting || articles.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export JSON'}
          </Button>
        </div>
      </div>

      {/* Job Progress */}
      <div className="mb-8">
        <JobProgress
          job={job}
          articles={articles}
          onStartSearch={() => console.log("Start search")}
          onStartResolve={() => console.log("Start resolve")}
          onStartDownload={() => console.log("Start download")}
        />
      </div>

      {/* Results Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <ResultsTable
          articles={articles}
          onRetryArticle={handleRetryArticle}
          onPreviewArticle={handlePreviewArticle}
          onDownloadArticle={handleDownloadArticle}
          onBulkRetry={handleBulkRetry}
          onBulkDownload={handleBulkDownload}
        />
      </div>

      {/* Job Summary */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-4">Job Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium text-foreground">Query</p>
            <p className="text-muted-foreground truncate" title={job.query}>
              {job.query}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Configuration</p>
            <p className="text-muted-foreground">
              Max: {job.max_results} • Concurrency: {job.concurrency}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Sources</p>
            <p className="text-muted-foreground">
              {job.pmc_only ? "PMC Only" : "PMC + External"}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Created</p>
            <p className="text-muted-foreground">
              {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
