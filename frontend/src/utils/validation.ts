/**
 * Validates a PubMed query string
 */
export function validatePubMedQuery(query: string): { isValid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: 'Query cannot be empty' };
  }

  if (query.length > 2000) {
    return { isValid: false, error: 'Query is too long (max 2000 characters)' };
  }

  // Basic check for potentially harmful characters
  const dangerousChars = /[<>{}[\]\\]/;
  if (dangerousChars.test(query)) {
    return { isValid: false, error: 'Query contains invalid characters' };
  }

  return { isValid: true };
}

/**
 * Validates job configuration parameters
 */
export function validateJobConfig(config: {
  max_results?: number;
  concurrency?: number;
  date_from?: string;
  date_to?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.max_results !== undefined) {
    if (config.max_results < 1 || config.max_results > 1000) {
      errors.push('Max results must be between 1 and 1000');
    }
  }

  if (config.concurrency !== undefined) {
    if (config.concurrency < 1 || config.concurrency > 10) {
      errors.push('Concurrency must be between 1 and 10');
    }
  }

  if (config.date_from && config.date_to) {
    const fromDate = new Date(config.date_from);
    const toDate = new Date(config.date_to);

    if (fromDate > toDate) {
      errors.push('Start date must be before end date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

