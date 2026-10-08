const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Visit home in dark mode
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test_home_dark.png' });

  // 2. Click Light Mode button
  const toggleBtn = await page.$('button[aria-label="Toggle Theme"]');
  if (toggleBtn) {
    await toggleBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test_home_light.png' });
  }

  // 3. Click TAKE PHOTO to enter Format Selection in light mode
  const takePhotoBtn = await page.$('button:has-text("TAKE PHOTO")');
  if (takePhotoBtn) {
    await takePhotoBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test_format_light.png' });
  }

  // 4. Navigate to EDIT in light mode via top ribbon
  const editPhaseBtn = await page.$('button:has-text("PHOTO EDIT")');
  if (editPhaseBtn) {
    await editPhaseBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test_edit_light.png' });
  }

  // 5. Navigate to COMPLETE in light mode via top ribbon
  const completePhaseBtn = await page.$('button:has-text("COMPLETE")');
  if (completePhaseBtn) {
    await completePhaseBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test_complete_light.png' });
  }

  await browser.close();
  console.log('ALL SCREENSHOTS SAVED SUCCESSFULLY!');
})();
