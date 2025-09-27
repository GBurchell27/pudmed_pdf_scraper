import { BaseApiService, type ApiServiceConfig } from "./baseApiService";
import { type Job, type CreateJobRequest } from "@/types";

/**
 * Service responsible for all job-related REST calls.
 */
export class JobsApiService extends BaseApiService {
  constructor(config?: ApiServiceConfig) {
    super(config);
  }

  /**
   * Create a new scraping job with the supplied configuration.
   */
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    if (!jobData?.query?.trim()) {
      throw new Error("Job query is required.");
    }

    return this.postJson<Job>("/jobs", jobData);
  }

  /**
   * Fetch a single job by identifier.
   */
  async getJob(jobId: string): Promise<Job> {
    this.ensureId(jobId, "jobId");

    return this.getJson<Job>(`/jobs/${jobId}`);
  }

  /**
   * Trigger the PubMed search phase for a job.
   */
  async searchJob(jobId: string): Promise<Job> {
    this.ensureId(jobId, "jobId");

    return this.postJson<Job>(`/jobs/${jobId}/search`);
  }

  /**
   * Trigger the source resolution phase for a job.
   */
  async resolveJob(jobId: string): Promise<Job> {
    this.ensureId(jobId, "jobId");

    return this.postJson<Job>(`/jobs/${jobId}/resolve`);
  }

  /**
   * Trigger the download phase for a job.
   */
  async downloadJob(jobId: string): Promise<Job> {
    this.ensureId(jobId, "jobId");

    return this.postJson<Job>(`/jobs/${jobId}/download`);
  }

  /**
   * Export job metadata in CSV or JSON format.
   */
  async exportJob(jobId: string, format: "csv" | "json" = "csv"): Promise<Blob> {
    this.ensureId(jobId, "jobId");

    const searchParams = new URLSearchParams({ format });
    return this.getBlob(`/jobs/${jobId}/export?${searchParams.toString()}`);
  }

  /**
   * Download a ZIP archive containing all PDFs for the job.
   */
  async exportJobZip(jobId: string): Promise<Blob> {
    this.ensureId(jobId, "jobId");

    return this.getBlob(`/jobs/${jobId}/export-zip`);
  }

  private ensureId(value: string, field: string): void {
    if (!value || typeof value !== "string") {
      throw new Error(`${field} must be a non-empty string.`);
    }
  }
}

