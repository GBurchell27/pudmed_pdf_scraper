export interface Job {
  id: string;
  created_at: string;
  name: string;
  query: string;
  max_results: number;
  date_from?: string;
  date_to?: string;
  pmc_only: boolean;
  allow_external: boolean;
  concurrency: number;
  status: JobStatus;
  error_msg?: string;
}

export enum JobStatus {
  QUEUED = 'queued',
  SEARCHING = 'searching',
  RESOLVING = 'resolving',
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface CreateJobRequest {
  name: string;
  query: string;
  max_results?: number;
  date_from?: string;
  date_to?: string;
  pmc_only?: boolean;
  allow_external?: boolean;
  concurrency?: number;
}

export interface JobResponse extends Job {}

