const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 520, height: 850 } });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(500);

  // Switch to light mode
  const lightBtn = await page.$('button:has-text("LIGHT")');
  if (lightBtn) await lightBtn.click();
  await page.waitForTimeout(400);

  // Go to camera
  await page.click('button:has-text("TAKE PHOTO")');
  await page.waitForTimeout(400);
  await page.click('button:has-text("PROCEED TO CAMERA")');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(__dirname, '../dist_qa_screenshots/05_light_mode_pose.png') });
  await browser.close();
  console.log('Light mode screenshot captured!');
})().catch(console.error);
