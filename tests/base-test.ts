import { initPage, page, testData } from '../setup';
import { Helper } from '../utils/helper';
import { printLog } from '../utils/logger';

export default class BaseTest extends Helper {
  constructor() {
    super();
  }

  public async init(link: string = testData.BASE_URL): Promise<void> {
    await initPage();
    await this.openHomePage(link);
  }

  public async openHomePage(link: string): Promise<void> {
    printLog(`Access to Customer Portal: ${link}`);
    await this.goto(link);
  }

  public async goto(link: string): Promise<void> {
    await page.goto(link, {
      waitUntil: 'load',
    });
  }
}