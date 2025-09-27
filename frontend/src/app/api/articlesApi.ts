import { BaseApiService, type ApiServiceConfig } from "./baseApiService";
import { type Article } from "@/types";

/**
 * Service responsible for article-level actions such as retries and crawl triggers.
 */
export class ArticlesApiService extends BaseApiService {
  constructor(config?: ApiServiceConfig) {
    super(config);
  }

  /**
   * Fetch the complete results for a job.
   */
  async getJobArticles(jobId: string): Promise<Article[]> {
    this.ensureId(jobId, "jobId");

    return this.getJson<Article[]>(`/jobs/${jobId}/results`);
  }

  /**
   * Retry processing for a single article.
   */
  async retryArticle(articleId: string): Promise<Article> {
    this.ensureId(articleId, "articleId");

    return this.postJson<Article>(`/articles/${articleId}/retry`);
  }

  /**
   * Manually trigger the crawl flow for a single article.
   */
  async crawlArticle(articleId: string): Promise<Article> {
    this.ensureId(articleId, "articleId");

    return this.postJson<Article>(`/articles/${articleId}/crawl`);
  }

  private ensureId(value: string, field: string): void {
    if (!value || typeof value !== "string") {
      throw new Error(`${field} must be a non-empty string.`);
    }
  }
}

