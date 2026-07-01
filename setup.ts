import { BrowserContext, chromium, firefox, LaunchOptions, Page, ViewportSize } from '@playwright/test';
import { PlaywrightEnvironment } from './utils/types';
import * as dotenv from 'dotenv';
import { printLog } from './utils/logger';

/**
 * In order to facilitate the current implementation of the page object model
 * only the "page" variable shall be exposed as external variable.
 * Everything else should be available using a method.
 */
export let page: Page;
export let browserContext: BrowserContext;
export let baseUrl: string;

// This summarizes all playwright runtime relevant data
const playwrightEnv: PlaywrightEnvironment = {
  page: null,
  browser: null,
  browserContext: null,
  browserContextOptions: {},
  baseUrl: ''
};

/**
 * Initialize Playwright page and browser context
 * Use to set up the testing environment before tests execution (Call in BaseTest setup)
 * @returns PlaywrightEnvironment object containing page, browser, and context
 */
export async function initPage(): Promise<PlaywrightEnvironment> {
    dotenv.config({ path: '.env', override: true });
  if (!playwrightEnv.page) {
    const viewPortSize: ViewportSize = { width: 1280, height: 800 };
    const launchOptions: LaunchOptions = {
      slowMo: 50,
      headless: process.env.HEADLESS ? true : false
    };
    // Launch browser and create a new chrome browser context with the specified options
    // Get browser type from environment variable, default to chromium if not specified

    printLog('Loading test data from environment variables');
    printLog(`BROWSER: ${process.env.BROWSER}`);
    printLog(`BASE_URL: ${process.env.BASE_URL}`);
    playwrightEnv.baseUrl = String(process.env.BASE_URL);
    if (process.env.BROWSER === 'chromium') {
      playwrightEnv.browser = await chromium.launch(launchOptions);
    } else if (process.env.BROWSER === 'chromium-headless') {
      launchOptions.headless = true;
      playwrightEnv.browser = await chromium.launch(launchOptions);
    } else if (process.env.BROWSER === 'firefox') {
      // Implement Firefox launch logic here
      playwrightEnv.browser = await firefox.launch(launchOptions);
    } else {
      playwrightEnv.browser = await chromium.launch(launchOptions);
    }

    if (!playwrightEnv.browser) {
      throw new Error('Browser failed to launch');
    }

    playwrightEnv.browserContextOptions.viewport = viewPortSize;
    playwrightEnv.browserContextOptions.acceptDownloads = true;
    playwrightEnv.browserContextOptions.recordVideo = {
      dir: 'test-results/record-video/',
      size: { width: 1280, height: 800 }
    };
    playwrightEnv.browserContext = await playwrightEnv.browser.newContext(playwrightEnv.browserContextOptions);
    playwrightEnv.page = await playwrightEnv.browserContext.newPage();
    // Set the global variable for an easier export to the Page Object Models (...)
    page = playwrightEnv.page;
    browserContext = playwrightEnv.browserContext;
  }
  return playwrightEnv;
}

/**
 * Tear down Playwright page, context, and browser.
 * Use to clean up the testing environment after tests execution (Call in BaseTest teardown / test.afterAll)
 */
export async function closePage(): Promise<void> {
  if (playwrightEnv.browserContext) {
    await playwrightEnv.browserContext.close();
    playwrightEnv.browserContext = null;
  }
  if (playwrightEnv.browser) {
    await playwrightEnv.browser.close();
    playwrightEnv.browser = null;
  }
  playwrightEnv.page = null;
}


export class TestData {

  readonly BASE_URL: string;

  constructor() {
    dotenv.config({ path: __dirname + '/.env' });
    // COMMON DATA
    printLog('Loading test data from environment variables');
    printLog(`BASE_URL: ${process.env.BASE_URL}`);
    this.BASE_URL = String(process.env.BASE_URL);
  }

}
export const testData = new TestData();