export interface Article {
  id: string;
  job_id: string;
  pmid: string;
  title: string;
  pubmed_url: string;
  pmc_id?: string;
  external_url?: string;
  chosen_pdf_url?: string;
  status: ArticleStatus;
  failure_reason?: string;
  retries: number;
}

export enum ArticleStatus {
  PENDING_URLS = 'pending_urls',
  RESOLVED = 'resolved',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  FAILED_SEARCH = 'failed_search',
  FAILED_PAYWALL = 'failed_paywall',
  SKIPPED_NO_PMC = 'skipped_no_pmc',
  SKIPPED_ROBOTS = 'skipped_robots'
}

export interface ArticleResponse extends Article {}

