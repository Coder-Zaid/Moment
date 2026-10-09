const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotDir = path.join(__dirname, '../dist_qa_screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 520, height: 850 } });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(600);

  // Go to camera mode
  await page.click('button:has-text("TAKE PHOTO")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("PROCEED TO CAMERA")');
  await page.waitForTimeout(1200);

  // 1. Screenshot of Pose Idea before shutter
  await page.screenshot({ path: path.join(screenshotDir, '01_pose_before_shutter.png') });
  console.log('1. Captured pose before shutter');

  // 2. Click "Next Pose" button to test cycling to different pose
  const nextPoseBtn = await page.$('button:has-text("Next Pose")');
  if (nextPoseBtn) {
    await nextPoseBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '02_different_pose_cycle.png') });
    console.log('2. Captured different pose after cycling');
  }

  // 3. Click shutter button
  const shutterBtn = await page.$('button[aria-label="Take Photo"]');
  if (shutterBtn) {
    await shutterBtn.click();
    // Wait 1.2s to be in the middle of the 3-2-1 countdown on the camera
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(screenshotDir, '03_camera_during_countdown.png') });
    console.log('3. Captured live camera during countdown');

    // Wait for countdown + flash + capture to complete (3s countdown + 0.5s flash/save)
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '04_shot2_new_pose.png') });
    console.log('4. Captured shot 2 with new different pose');
  }

  await browser.close();
  console.log('All QA screenshots captured successfully!');
})().catch(err => {
  console.error('Error running test script:', err);
  process.exit(1);
});
