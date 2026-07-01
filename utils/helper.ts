
/**
 * Helper class for general utility methods
 * Does not contain Page or Locator methods (those are in BasePage)
 */
export class Helper {
  /**
   * Wait for a specific amount of time
   * @param ms - Time to wait in milliseconds
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a random string of specified length
   * @param length - Length of the string
   * @returns Random string
   */
  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate a random number within a range
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random number
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random email address
   * @param domain - Email domain (default: 'test.com')
   * @returns Random email address
   */
  static generateRandomEmail(domain: string = 'test.com'): string {
    return `user_${this.generateRandomString(8)}_${Date.now()}@${domain}`;
  }

  /**
   * Format date to a specific format
   * @param date - Date object
   * @param format - Format string (default: 'YYYY-MM-DD')
   * @returns Formatted date string
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Get current timestamp
   * @returns Timestamp in milliseconds
   */
  static getCurrentTimestamp(): number {
    return Date.now();
  }

  /**
   * Sanitize string for use in filenames
   * @param str - String to sanitize
   * @returns Sanitized string
   */
  static sanitizeFilename(str: string): string {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  /**
   * Generate unique ID
   * @returns Unique ID string
   */
  static generateUniqueId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep clone an object
   * @param obj - Object to clone
   * @returns Cloned object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if string is valid email
   * @param email - Email string to validate
   * @returns True if valid email, false otherwise
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Convert string to title case
   * @param str - String to convert
   * @returns Title case string
   */
  static toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  /**
   * Truncate string to specified length
   * @param str - String to truncate
   * @param length - Maximum length
   * @param suffix - Suffix to add (default: '...')
   * @returns Truncated string
   */
  static truncateString(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) {
      return str;
    }
    if (length <= suffix.length) {
      return str.substring(0, length);
    }
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Retry async function with exponential backoff
   * @param fn - Async function to retry
   * @param retries - Number of retries
   * @param delay - Initial delay in milliseconds
   * @returns Result from function
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await this.wait(delay * Math.pow(2, i));
        }
      }
    }
    throw lastError;
  }

  /**
   * Parse query string to object
   * @param queryString - Query string (e.g., '?key=value&foo=bar')
   * @returns Object with key-value pairs
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Build query string from object
   * @param params - Object with key-value pairs
   * @returns Query string
   */
  static buildQueryString(params: Record<string, string | number | boolean>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    return searchParams.toString();
  }
}