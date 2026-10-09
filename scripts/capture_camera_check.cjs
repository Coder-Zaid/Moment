const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 502, height: 716 } });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(600);

  const lightBtn = await page.$('button:has-text("LIGHT")');
  if (lightBtn) await lightBtn.click();
  await page.waitForTimeout(400);

  await page.click('button:has-text("TAKE PHOTO")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("PROCEED TO CAMERA")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, '../dist_qa_screenshots/camera_light_fixed.png') });

  const darkBtn = await page.$('button:has-text("DARK")');
  if (darkBtn) await darkBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(__dirname, '../dist_qa_screenshots/camera_dark_fixed.png') });

  await browser.close();
  console.log('Camera screenshots captured!');
})().catch(console.error);
