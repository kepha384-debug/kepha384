
/**
 * Utility for retrying Gemini API calls with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 2000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      
      const isRateLimit = err.message?.includes('429') || err.status === 'RESOURCE_EXHAUSTED';
      const isOverloaded = err.message?.includes('503') || err.status === 'UNAVAILABLE';
      
      if (i < maxRetries && (isRateLimit || isOverloaded)) {
        // For rate limits, use a longer initial delay (10s)
        const baseDelay = isRateLimit ? 10000 : initialDelay;
        const delay = baseDelay * Math.pow(2, i);
        console.warn(`[GeminiRetry] Rate limit or overload hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw err;
    }
  }
  
  throw lastError;
}
