import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('list-editor', () => {
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

    browser = await puppetteer.launch({
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

  test('should add do something', async () => {
    await page.goto(baseUrl);
  });

  test('open modal form', async () => {
    await page.goto(baseUrl);
    const addButton = await page.$('.header__add a');
    addButton.click();
    await page.waitForSelector('.modal-form.active');
  });

  test(' not Valid input name', async () => {
    await page.goto(baseUrl);
    const addButton = await page.$('.header__add a');
    const button = await page.$('.button-save');
    addButton.click();
    await page.waitForSelector('.modal-form.active');
    button.click();
    await page.waitForSelector('.form-error');
  });

  test('not Valid input price', async () => {
    await page.goto(baseUrl);
    const addButton = await page.$('.header__add a');
    const formName = await page.$('#form__name');
    const button = await page.$('.button-save');
    addButton.click();
    await page.waitForSelector('.modal-form.active');
    await formName.type('samsung');
    button.click();
    await page.waitForSelector('.form-error');
  });

  test('not Valid input price for string', async () => {
    await page.goto(baseUrl);
    const addButton = await page.$('.header__add a');
    const formName = await page.$('#form__name');
    const button = await page.$('.button-save');
    const formPrice = await page.$('#form__price');
    addButton.click();
    await page.waitForSelector('.modal-form.active');
    await formName.type('samsung');
    await formPrice.type('price');
    button.click();
    await page.waitForSelector('.form-error');
  });
});
