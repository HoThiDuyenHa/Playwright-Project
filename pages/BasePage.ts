import { Page, Locator, BrowserContext } from '@playwright/test';
import { Helper } from '../utils/helper';
import { browserContext, testData } from '../setup';

export class BasePage extends Helper {
    readonly page: Page;
    readonly browserContext: BrowserContext;
    testData: any;

    constructor(page: Page) {
        super();
        this.page = page;
        this.browserContext = browserContext;
        this.testData = testData;
    }

    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }
}