import { ArticleStatus, JobStatus, type Article, type Job } from "@/types";

/**
 * Canonical mock job used while the backend is still under development.
 */
export const MOCK_JOB: Job = {
  id: "job_123",
  created_at: new Date("2024-05-01T09:30:00Z").toISOString(),
  name: "Atrial Fibrillation Research",
  query: '("atrial fibrillation"[tiab]) AND (malnutrition[tiab])',
  max_results: 50,
  date_from: "2020-01-01",
  date_to: "2024-04-30",
  pmc_only: false,
  allow_external: true,
  concurrency: 3,
  status: JobStatus.DOWNLOADING,
  error_msg: undefined,
};

/**
 * Mock article dataset representing realistic pipeline states.
 */
export const MOCK_ARTICLES: Article[] = [
  {
    id: "article_1",
    job_id: MOCK_JOB.id,
    pmid: "32345678",
    title: "Effects of malnutrition on atrial fibrillation outcomes",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/32345678/",
    pmc_id: "PMC7654321",
    chosen_pdf_url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7654321/pdf",
    status: ArticleStatus.DOWNLOADED,
    retries: 0,
  },
  {
    id: "article_2",
    job_id: MOCK_JOB.id,
    pmid: "33445566",
    title: "Nutritional deficiencies and atrial remodeling",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/33445566/",
    pmc_id: "PMC7788991",
    chosen_pdf_url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7788991/pdf",
    status: ArticleStatus.DOWNLOADED,
    retries: 0,
  },
  {
    id: "article_3",
    job_id: MOCK_JOB.id,
    pmid: "31223344",
    title: "Protein-energy malnutrition in arrhythmia clinics",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/31223344/",
    external_url: "https://journal.example.com/article/31223344",
    chosen_pdf_url: undefined,
    status: ArticleStatus.RESOLVED,
    retries: 1,
  },
  {
    id: "article_4",
    job_id: MOCK_JOB.id,
    pmid: "37651234",
    title: "Electrolyte imbalance as a predictor of atrial fibrillation",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/37651234/",
    external_url: "https://journal-paywalled.example.com/article/37651234",
    failure_reason: "Publisher paywall detected",
    status: ArticleStatus.FAILED_PAYWALL,
    retries: 2,
  },
  {
    id: "article_5",
    job_id: MOCK_JOB.id,
    pmid: "39887711",
    title: "Dietary interventions for atrial fibrillation prevention",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/39887711/",
    pmc_id: undefined,
    external_url: "https://open-access.example.com/articles/39887711",
    status: ArticleStatus.DOWNLOADING,
    retries: 0,
  },
  {
    id: "article_6",
    job_id: MOCK_JOB.id,
    pmid: "31224455",
    title: "Malnutrition screening in cardiology wards",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/31224455/",
    status: ArticleStatus.PENDING_URLS,
    retries: 0,
  },
  {
    id: "article_7",
    job_id: MOCK_JOB.id,
    pmid: "35551234",
    title: "Crawling challenges in medical journal archives",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/35551234/",
    external_url: "https://robots-blocked.example.com/article/35551234",
    failure_reason: "Robots.txt disallows crawling",
    status: ArticleStatus.SKIPPED_ROBOTS,
    retries: 1,
  },
  {
    id: "article_8",
    job_id: MOCK_JOB.id,
    pmid: "34455667",
    title: "Micronutrient therapy adherence in atrial fibrillation",
    pubmed_url: "https://pubmed.ncbi.nlm.nih.gov/34455667/",
    status: ArticleStatus.RESOLVED,
    retries: 0,
  },
];


