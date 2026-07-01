import { BrowserContextOptions, Browser, Page, BrowserContext } from '@playwright/test';

/**
 * User credentials structure
 */
export type UserCredentials = {
    email: string
    password: string
}

/**
 * Test configuration loaded from environment variables
 * Environment variables are loaded by dotenvx before test execution
 * See env/.env.{dev|qa|stg|prd} for environment-specific configurations
 */
export type TestConfig = {
    DEBUG_LEVEL: string
    BASE_URL: string
    IS_HEADLESS: boolean
    USER_EMAIL: string
    USER_PASS: string
    USER_EMAIL_2: string
    COMPANY_ID: number
    API_HOST: string
    LOKI_HOST?: string
    LOCAL_ENV: boolean
    USER_EMAIL_FIRST_LOGIN: string
    USER_PASS_FIRST_LOGIN: string
    BASE_ENDPOINT: string
    USER_EMAIL_EMPTY: string

    GMAIL_EMAIL: string
    GMAIL_PASSWORD: string
    // Dynamic users support
    users: Map<string, UserCredentials>
}

export interface PlaywrightEnvironment {
  page: Page | null;
  browser: Browser | null;
  browserContext: BrowserContext | null;
  browserContextOptions: BrowserContextOptions;
  baseUrl: string;
}

// Test modals
export interface AddressModal {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}