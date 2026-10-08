const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureAllScreens() {
  const outputDir = path.join(__dirname, '../dist_qa_screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // 1. Dark Mode Home
  await page.screenshot({ path: path.join(outputDir, '01_home_dark.png') });
  console.log('Saved 01_home_dark.png');

  // Toggle to Light Mode
  const lightBtn = await page.$('button:has-text("LIGHT")');
  if (lightBtn) {
    await lightBtn.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '01_home_light.png') });
    console.log('Saved 01_home_light.png');
  }

  // Go to Format Selection in Light Mode
  await page.click('button:has-text("FORMAT SELECTION")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputDir, '02_format_light.png') });
  console.log('Saved 02_format_light.png');

  // Toggle back to Dark Mode on Format Selection
  const darkBtn = await page.$('button:has-text("DARK")');
  if (darkBtn) {
    await darkBtn.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '02_format_dark.png') });
    console.log('Saved 02_format_dark.png');
  }

  // Go to Printing screen in Dark Mode
  await page.click('button:has-text("PRINTING")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputDir, '03_printing_dark.png') });
  console.log('Saved 03_printing_dark.png');

  // Go to Complete screen in Dark Mode
  await page.click('button:has-text("COMPLETE")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputDir, '04_complete_dark.png') });
  console.log('Saved 04_complete_dark.png');

  // Toggle Complete screen to Light Mode
  const lightBtnComplete = await page.$('button:has-text("LIGHT")');
  if (lightBtnComplete) {
    await lightBtnComplete.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '04_complete_light.png') });
    console.log('Saved 04_complete_light.png');
  }

  // Go to Film Preview screen in Light Mode
  await page.click('button:has-text("FILM PREVIEW")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputDir, '05_preview_light.png') });
  console.log('Saved 05_preview_light.png');

  // Toggle Film Preview screen to Dark Mode
  const darkBtnPreview = await page.$('button:has-text("DARK")');
  if (darkBtnPreview) {
    await darkBtnPreview.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '05_preview_dark.png') });
    console.log('Saved 05_preview_dark.png');
  }

  // Go to Printing screen in Light Mode
  await page.click('button:has-text("PRINTING")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputDir, '03_printing_light.png') });
  console.log('Saved 03_printing_light.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

captureAllScreens().catch(console.error);
