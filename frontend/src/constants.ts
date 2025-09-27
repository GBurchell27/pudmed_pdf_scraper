// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Job Configuration Defaults
export const JOB_DEFAULTS = {
  MAX_RESULTS: 100,
  CONCURRENCY: 3,
  PMC_ONLY: false,
  ALLOW_EXTERNAL: true,
} as const;

// Job Configuration Limits
export const JOB_LIMITS = {
  MAX_RESULTS_MIN: 1,
  MAX_RESULTS_MAX: 1000,
  CONCURRENCY_MIN: 1,
  CONCURRENCY_MAX: 10,
  QUERY_MAX_LENGTH: 2000,
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  POLLING_INTERVAL: 2000,
  MAX_FILE_SIZE_DISPLAY: 50 * 1024 * 1024, // 50MB
} as const;

// File Types
export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
} as const;

// Status Colors
export const STATUS_COLORS = {
  queued: 'blue',
  searching: 'purple',
  resolving: 'orange',
  downloading: 'indigo',
  completed: 'green',
  failed: 'red',
  pending_urls: 'gray',
  resolved: 'blue',
  downloaded: 'green',
  failed_search: 'red',
  failed_paywall: 'red',
  skipped_no_pmc: 'yellow',
  skipped_robots: 'yellow',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

