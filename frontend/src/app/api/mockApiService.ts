import { ArticlesApiService } from "./articlesApi";
import { JobsApiService } from "./jobsApi";
import { MOCK_ARTICLES, MOCK_JOB } from "./mockData";
import { ArticleStatus, JobStatus, type Article, type Job, type CreateJobRequest } from "@/types";

const DEFAULT_DELAY_MS = 200;

function delay<T>(value: T, waitMs: number): Promise<T> {
  if (!waitMs) {
    return Promise.resolve(value);
  }

  return new Promise((resolve) => setTimeout(() => resolve(value), waitMs));
}

/**
 * Lightweight mock that mimics the Jobs API using in-memory data.
 */
export class MockJobsApiService extends JobsApiService {
  private currentJob: Job;
  private readonly delayMs: number;

  constructor(delayMs: number = DEFAULT_DELAY_MS) {
    super({ baseUrl: "" });
    this.delayMs = delayMs;
    this.currentJob = { ...MOCK_JOB };
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    this.currentJob = {
      ...MOCK_JOB,
      id: `job_${Date.now()}`,
      created_at: new Date().toISOString(),
      name: jobData.name,
      query: jobData.query,
      max_results: jobData.max_results ?? MOCK_JOB.max_results,
      date_from: jobData.date_from ?? MOCK_JOB.date_from,
      date_to: jobData.date_to ?? MOCK_JOB.date_to,
      pmc_only: jobData.pmc_only ?? MOCK_JOB.pmc_only,
      allow_external: jobData.allow_external ?? MOCK_JOB.allow_external,
      concurrency: jobData.concurrency ?? MOCK_JOB.concurrency,
      status: JobStatus.QUEUED,
      error_msg: undefined,
    };

    return delay({ ...this.currentJob }, this.delayMs);
  }

  async getJob(): Promise<Job> {
    return delay({ ...this.currentJob }, this.delayMs);
  }

  async searchJob(): Promise<Job> {
    this.currentJob = { ...this.currentJob, status: JobStatus.SEARCHING };
    return delay({ ...this.currentJob }, this.delayMs);
  }

  async resolveJob(): Promise<Job> {
    this.currentJob = { ...this.currentJob, status: JobStatus.RESOLVING };
    return delay({ ...this.currentJob }, this.delayMs);
  }

  async downloadJob(): Promise<Job> {
    this.currentJob = { ...this.currentJob, status: JobStatus.DOWNLOADING };
    return delay({ ...this.currentJob }, this.delayMs);
  }

  async exportJob(): Promise<Blob> {
    return delay(new Blob([JSON.stringify(MOCK_ARTICLES, null, 2)], { type: "application/json" }), this.delayMs);
  }

  async exportJobZip(): Promise<Blob> {
    return delay(new Blob([], { type: "application/zip" }), this.delayMs);
  }
}

/**
 * Lightweight mock for article-specific operations.
 */
export class MockArticlesApiService extends ArticlesApiService {
  private readonly articleStore = new Map<string, Article[]>();
  private readonly delayMs: number;

  constructor(delayMs: number = DEFAULT_DELAY_MS) {
    super({ baseUrl: "" });
    this.delayMs = delayMs;
  }

  async getJobArticles(jobId: string): Promise<Article[]> {
    const articles = this.ensureJobArticles(jobId);
    return delay(articles.map((article) => ({ ...article })), this.delayMs);
  }

  async retryArticle(articleId: string): Promise<Article> {
    const article = this.findArticle(articleId);
    if (!article) {
      throw new Error(`Article with id "${articleId}" not found in mock dataset.`);
    }

    article.status = ArticleStatus.DOWNLOADING;
    article.retries += 1;
    article.failure_reason = undefined;

    return delay({ ...article }, this.delayMs);
  }

  async crawlArticle(articleId: string): Promise<Article> {
    const article = this.findArticle(articleId);
    if (!article) {
      throw new Error(`Article with id "${articleId}" not found in mock dataset.`);
    }

    article.status = ArticleStatus.RESOLVED;
    if (!article.chosen_pdf_url) {
      article.chosen_pdf_url = `${article.pubmed_url.replace(/\/$/, "")}.pdf`;
    }
    article.failure_reason = undefined;

    return delay({ ...article }, this.delayMs);
  }

  private ensureJobArticles(jobId: string): Article[] {
    if (!this.articleStore.has(jobId)) {
      const clones = MOCK_ARTICLES.map((article, index) => ({
        ...article,
        id: `${jobId}_art_${index + 1}`,
        job_id: jobId,
      }));
      this.articleStore.set(jobId, clones);
    }

    return this.articleStore.get(jobId)!;
  }

  private findArticle(articleId: string): Article | undefined {
    for (const articles of this.articleStore.values()) {
      const found = articles.find((article) => article.id === articleId);
      if (found) {
        return found;
      }
    }

    return undefined;
  }
}

