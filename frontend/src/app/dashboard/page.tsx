"use client";

import * as React from "react";
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  ArrowRight,
  Activity
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Job, JobStatus } from "@/types";
import { formatJobStatus, formatDate } from "@/utils";

// Mock data for recent jobs
const mockRecentJobs: Job[] = [
  {
    id: "job_001",
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    name: "Cardiology Research Papers",
    query: '("cardiology"[tiab]) AND ("myocardial infarction"[tiab])',
    max_results: 100,
    pmc_only: true,
    allow_external: false,
    concurrency: 3,
    status: JobStatus.COMPLETED,
  },
  {
    id: "job_002",
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    name: "Neurology Studies",
    query: '("neurology"[tiab]) AND ("alzheimer\'s"[tiab])',
    max_results: 50,
    pmc_only: false,
    allow_external: true,
    concurrency: 2,
    status: JobStatus.FAILED,
    error_msg: "Rate limit exceeded",
  },
  {
    id: "job_003",
    created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    name: "Oncology Research",
    query: '("oncology"[tiab]) AND ("breast cancer"[tiab])',
    max_results: 75,
    pmc_only: false,
    allow_external: true,
    concurrency: 4,
    status: JobStatus.DOWNLOADING,
  },
  {
    id: "job_004",
    created_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    name: "Pediatrics Review",
    query: '("pediatrics"[tiab]) AND ("vaccination"[tiab])',
    max_results: 25,
    pmc_only: true,
    allow_external: false,
    concurrency: 2,
    status: JobStatus.SEARCHING,
  },
];

export default function DashboardPage() {
  const getJobStats = () => {
    const stats = {
      total: mockRecentJobs.length,
      completed: mockRecentJobs.filter(job => job.status === JobStatus.COMPLETED).length,
      failed: mockRecentJobs.filter(job => job.status === JobStatus.FAILED).length,
      running: mockRecentJobs.filter(job =>
        job.status === JobStatus.SEARCHING ||
        job.status === JobStatus.RESOLVING ||
        job.status === JobStatus.DOWNLOADING
      ).length,
    };

    return stats;
  };

  const jobStats = getJobStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Research Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your PubMed scraping jobs and track research progress
          </p>
        </div>
        <Link href="/jobs/new">
          <Button className="btn-gradient hover-lift">
            <Plus className="w-4 h-4 mr-2" />
            New Research Job
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-elevated p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-3xl font-bold">{jobStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-3xl font-bold text-success">{jobStats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-info/10 rounded-xl">
              <Clock className="w-6 h-6 text-info" />
            </div>
            <div className="min-w-0">
              <p className="text-3xl font-bold text-info">{jobStats.running}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="min-w-0">
              <p className="text-3xl font-bold text-destructive">{jobStats.failed}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Recent Jobs</h2>
            <p className="text-muted-foreground">Track your latest research jobs and their progress</p>
          </div>
          <Link href="/jobs">
            <Button variant="outline" className="hover-lift">
              View All Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {mockRecentJobs.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first research job
            </p>
            <Link href="/jobs/new">
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Create First Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {mockRecentJobs.map((job, index) => (
              <div
                key={job.id}
                className="card-interactive p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg mb-1 truncate">{job.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusChip variant={
                          job.status === JobStatus.FAILED ? "failed" :
                          job.status === JobStatus.COMPLETED ? "completed" :
                          job.status === JobStatus.DOWNLOADING ? "downloading" :
                          job.status === JobStatus.SEARCHING ? "searching" :
                          "default"
                        }>
                          {formatJobStatus(job.status)}
                        </StatusChip>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm" className="hover-lift">
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Search Query</p>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded text-foreground truncate" title={job.query}>
                      {job.query}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Configuration</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                        {job.max_results} results
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                        {job.concurrency}x concurrent
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                        {job.pmc_only ? "PMC only" : "All sources"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Progress</p>
                    <div className="flex items-center gap-2">
                      {job.status === JobStatus.COMPLETED && (
                        <span className="text-sm text-success flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </span>
                      )}
                      {job.status === JobStatus.FAILED && (
                        <span className="text-sm text-destructive flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                      {(job.status === JobStatus.SEARCHING || job.status === JobStatus.DOWNLOADING) && (
                        <span className="text-sm text-info flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-info animate-pulse" />
                          Processing
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {job.error_msg && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      {job.error_msg}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/jobs/new" className="card-interactive p-6 text-center hover-lift">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Create New Job</h3>
          <p className="text-sm text-muted-foreground">
            Start a new research job with custom parameters
          </p>
        </Link>

        <Link href="/jobs" className="card-interactive p-6 text-center hover-lift">
          <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-info" />
          </div>
          <h3 className="font-semibold mb-2">Manage Jobs</h3>
          <p className="text-sm text-muted-foreground">
            View and manage all your research jobs
          </p>
        </Link>

        <Link href="/docs" className="card-interactive p-6 text-center hover-lift">
          <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground">
            Learn how to optimize your research workflow
          </p>
        </Link>
      </div>
    </div>
  );
}
