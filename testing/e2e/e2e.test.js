import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should validate credit card number', async () => {
    await page.goto(baseUrl);

    // Вводим номер карты
    await page.type('#card-number-input', '4111111111111111');

    // Нажимаем кнопку проверки
    await page.click('#validate-button');

    // Ждем, пока результат проверки не появится
    await page.waitForSelector('#payment-system-info');

    // Проверяем, что текст о платежной системе появился
    const paymentSystemInfoText = await page.$eval('#payment-system-info', el => el.textContent);
    expect(paymentSystemInfoText).toContain('Платежная система');
  });
});
