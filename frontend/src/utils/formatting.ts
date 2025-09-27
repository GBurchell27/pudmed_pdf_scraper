import { JobStatus, ArticleStatus } from '@/types';

/**
 * Formats a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Formats file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats job status for display
 */
export function formatJobStatus(status: JobStatus): string {
  const statusMap: Record<JobStatus, string> = {
    [JobStatus.QUEUED]: 'Queued',
    [JobStatus.SEARCHING]: 'Searching',
    [JobStatus.RESOLVING]: 'Resolving',
    [JobStatus.DOWNLOADING]: 'Downloading',
    [JobStatus.COMPLETED]: 'Completed',
    [JobStatus.FAILED]: 'Failed',
  };

  return statusMap[status] || status;
}

/**
 * Formats article status for display
 */
export function formatArticleStatus(status: ArticleStatus): string {
  const statusMap: Record<ArticleStatus, string> = {
    [ArticleStatus.PENDING_URLS]: 'Pending URLs',
    [ArticleStatus.RESOLVED]: 'Resolved',
    [ArticleStatus.DOWNLOADING]: 'Downloading',
    [ArticleStatus.DOWNLOADED]: 'Downloaded',
    [ArticleStatus.FAILED_SEARCH]: 'Search Failed',
    [ArticleStatus.FAILED_PAYWALL]: 'Paywall Blocked',
    [ArticleStatus.SKIPPED_NO_PMC]: 'Skipped (No PMC)',
    [ArticleStatus.SKIPPED_ROBOTS]: 'Skipped (Robots)',
  };

  return statusMap[status] || status;
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formats a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

