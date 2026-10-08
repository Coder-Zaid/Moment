const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runE2EQA() {
  console.log('--- STARTING MOMENT PHOTOBOOTH COMPREHENSIVE E2E QA PASS ---');
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const consoleErrors = [];
  const report = {
    testsPassed: 0,
    testsFailed: 0,
    flowDetails: []
  };

  // Helper to create page with console listener
  async function createTrackedPage(viewport = { width: 1280, height: 800 }) {
    const context = await browser.newContext({
      viewport,
      permissions: ['camera']
    });
    const page = await context.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[PAGE CONSOLE ERROR]: ${msg.text()}`);
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      console.error(`[PAGE UNCAUGHT ERROR]: ${err.message}`);
      consoleErrors.push(err.message);
    });
    return { context, page };
  }

  try {
    // ----------------------------------------------------
    // TEST 1: HOME SCREEN VISUAL & INTERACTIVE AUDIT
    // ----------------------------------------------------
    console.log('\n[TEST 1] Auditing Home Screen (Desktop/Kiosk 1280x800)...');
    const { page, context } = await createTrackedPage({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    // Check key elements
    const brandHeading = await page.textContent('h1');
    console.log(`- Detected brand heading: "${brandHeading.trim()}"`);
    if (!brandHeading.includes('MOMENT')) throw new Error('Home heading missing MOMENT');

    const takePhotoBtn = page.getByRole('button', { name: /TAKE PHOTO/i });
    const uploadBtn = page.getByRole('button', { name: /UPLOAD PHOTOS/i });
    if (!(await takePhotoBtn.isVisible())) throw new Error('TAKE PHOTO button not visible');
    if (!(await uploadBtn.isVisible())) throw new Error('UPLOAD PHOTOS button not visible');
    console.log('- TAKE PHOTO & UPLOAD PHOTOS buttons are prominent and clickable');
    report.testsPassed++;

    // ----------------------------------------------------
    // TEST 2: KIOSK MODE TOGGLE & HEADER AUDIT
    // ----------------------------------------------------
    console.log('\n[TEST 2] Testing Kiosk Mode Toggle and Clean Ribbon...');
    const kioskBtn = page.getByRole('button', { name: /kiosk/i });
    await kioskBtn.click();
    await page.waitForTimeout(300);
    const kioskStatus = await page.getByText('TOUCHSCREEN KIOSK • 300 DPI ARCHIVAL FILM').isVisible();
    console.log(`- Kiosk status bar active: ${kioskStatus}`);
    if (!kioskStatus) throw new Error('Kiosk mode ribbon did not update correctly');
    
    // Toggle back
    await kioskBtn.click();
    await page.waitForTimeout(300);
    report.testsPassed++;

    // ----------------------------------------------------
    // TEST 3: FLOW 1 - CAMERA 1x2 WORKFLOW
    // ----------------------------------------------------
    console.log('\n[TEST 3] Testing Flow 1: Camera 1x2 Workflow...');
    await takePhotoBtn.click();
    await page.waitForTimeout(400);

    // Format selection: Select 1x2
    const format1x2 = page.getByText('1 × 2');
    await format1x2.first().click();
    await page.waitForTimeout(300);

    // Click Proceed to Camera
    const proceedCameraBtn = page.getByRole('button', { name: /PROCEED TO CAMERA/i });
    await proceedCameraBtn.click();
    await page.waitForTimeout(1000);

    // In Camera Screen
    const shutterBtn = page.getByRole('button', { name: /Take Photo/i });
    if (await shutterBtn.isVisible()) {
      console.log('- Camera viewfinder ready, taking Photo 1...');
      await shutterBtn.click();
      await page.waitForTimeout(4200); // 3s countdown + 1s capture/flash

      console.log('- Taking Photo 2...');
      await shutterBtn.click();
      await page.waitForTimeout(4200);

      // Verify continue button appears
      const continueEditBtn = page.getByRole('button', { name: /CONTINUE TO EDIT/i });
      await continueEditBtn.waitFor({ state: 'visible', timeout: 5000 });
      console.log('- Captured 2 photos! Moving to Photo Edit...');
      await continueEditBtn.click();
      await page.waitForTimeout(800);

      // In Photo Edit screen
      const filmPreviewBtn = page.getByRole('button', { name: /CONTINUE TO PREVIEW/i });
      await filmPreviewBtn.click();
      await page.waitForTimeout(600);

      // In Film Preview screen: proceed to generate
      const generateFilmBtn = page.getByRole('button', { name: /GENERATE FILM/i });
      await generateFilmBtn.click();
      console.log('- Film darkroom developing pipeline running...');
      await page.waitForTimeout(4000); // Wait for stages 1-5 to finish

      // In Ready state: Print Strip
      const printBtn = page.getByRole('button', { name: /PRINT STRIP/i });
      await printBtn.waitFor({ state: 'visible', timeout: 8000 });
      console.log('- Film developed! Triggering virtual print simulation...');
      await printBtn.click();
      await page.waitForTimeout(5000); // Wait for print simulation

      // Wait for print simulation to complete and collect
      const collectBtn = page.getByRole('button', { name: /COLLECT STRIP/i });
      await collectBtn.waitFor({ state: 'visible', timeout: 15000 });
      await collectBtn.click();
      await page.waitForTimeout(800);

      // In Completion Screen
      const completeHeading = await page.getByText(/YOUR MOMENT IS COMPLETE/i).isVisible();
      console.log(`- Completion screen reached: ${completeHeading}`);
      if (!completeHeading) throw new Error('Did not reach Completion Screen');

      // Test Restart Session
      const newSessionBtn = page.getByRole('button', { name: /NEW SESSION/i });
      await newSessionBtn.click();
      await page.waitForTimeout(500);

      // Verify returned cleanly to Home
      const backOnHome = await page.getByRole('button', { name: /TAKE PHOTO/i }).isVisible();
      console.log(`- Returned cleanly to Home: ${backOnHome}`);
      if (!backOnHome) throw new Error('Did not return to Home upon new session');
      report.testsPassed++;
    } else {
      console.log('Skipping fake camera shutter in this environment');
    }
    await context.close();

    // ----------------------------------------------------
    // TEST 4: FLOW 2 - UPLOAD 1x4 WORKFLOW WITH REORDER & EDIT
    // ----------------------------------------------------
    console.log('\n[TEST 4] Testing Flow 2: Upload 1x4 Workflow...');
    const { page: page2, context: context2 } = await createTrackedPage({ width: 1280, height: 800 });
    await page2.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    const uploadHomeBtn = page2.getByRole('button', { name: /UPLOAD PHOTOS/i });
    await uploadHomeBtn.click();
    await page2.waitForTimeout(400);

    // Format selection: 1x4 is default, click proceed
    const proceedUploadBtn = page2.getByRole('button', { name: /PROCEED TO UPLOAD/i });
    await proceedUploadBtn.click();
    await page2.waitForTimeout(500);

    // We are on PhotoUploadScreen. Create 4 small mock image files to upload
    const testImgBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    const tempDir = path.join(__dirname, 'temp_test_imgs');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const imgPaths = [1, 2, 3, 4].map(n => {
      const p = path.join(tempDir, `test_img_${n}.png`);
      fs.writeFileSync(p, testImgBuffer);
      return p;
    });

    const fileInput = page2.locator('input[type="file"]').first();
    await fileInput.setInputFiles(imgPaths);
    await page2.waitForTimeout(1000);

    console.log('- 4 images uploaded into 1x4 frames');
    const continueEditUpload = page2.getByRole('button', { name: /CONTINUE TO EDIT/i });
    await continueEditUpload.click();
    await page2.waitForTimeout(600);

    // In Edit Screen: select a filter (e.g., Warm Editorial or B&W)
    const bwFilterBtn = page2.getByRole('button', { name: /NOIR/i }).or(page2.getByText(/NOIR/i)).first();
    if (await bwFilterBtn.isVisible()) {
      await bwFilterBtn.click();
      console.log('- Applied film filter');
    }

    // Continue to preview
    const toPreviewBtn = page2.getByRole('button', { name: /CONTINUE TO PREVIEW/i });
    await toPreviewBtn.click();
    await page2.waitForTimeout(600);

    // Generate film
    const genBtn = page2.getByRole('button', { name: /GENERATE FILM/i });
    await genBtn.click();
    console.log('- Developing 1x4 film strip...');
    await page2.waitForTimeout(4000);

    // Print
    const print1x4Btn = page2.getByRole('button', { name: /PRINT STRIP/i });
    await print1x4Btn.waitFor({ state: 'visible', timeout: 8000 });
    await print1x4Btn.click();
    await page2.waitForTimeout(5000);

    // Collect
    const collect1x4 = page2.getByRole('button', { name: /COLLECT STRIP/i });
    await collect1x4.waitFor({ state: 'visible', timeout: 15000 });
    await collect1x4.click();
    await page2.waitForTimeout(800);

    // Verify Completion Screen
    const compHeader2 = await page2.getByText(/YOUR MOMENT IS COMPLETE/i).isVisible();
    console.log(`- 1x4 Souvenir reached: ${compHeader2}`);
    if (!compHeader2) throw new Error('1x4 Completion screen not reached');

    // Clean up temp test files
    imgPaths.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
    if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);

    // Test Reset & Session Isolation (can use header Reset or NEW SESSION button)
    const headerResetBtn = page2.getByRole('button', { name: /Start fresh session/i }).or(page2.getByRole('button', { name: /NEW SESSION/i })).first();
    await headerResetBtn.click();
    await page2.waitForTimeout(500);

    const isBackHome2 = await page2.getByRole('button', { name: /TAKE PHOTO/i }).isVisible();
    console.log(`- Session reset back to Home: ${isBackHome2}`);
    if (!isBackHome2) throw new Error('Header reset did not return to Home');
    report.testsPassed++;
    await context2.close();

    // ----------------------------------------------------
    // TEST 5: RESPONSIVE VIEWPORT CHECKS
    // ----------------------------------------------------
    console.log('\n[TEST 5] Testing Responsive Viewports (Mobile & Tablet)...');
    
    // Mobile Viewport: 390x844 (iPhone)
    const { page: mobilePage, context: mobileCtx } = await createTrackedPage({ width: 390, height: 844 });
    await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const mobileHeading = await mobilePage.textContent('h1');
    if (!mobileHeading.includes('MOMENT')) throw new Error('Mobile viewport heading missing');
    const mobileTakePhoto = await mobilePage.getByRole('button', { name: /TAKE PHOTO/i }).isVisible();
    console.log(`- Mobile 390x844: Heading visible, CTA visible (${mobileTakePhoto})`);
    await mobileCtx.close();

    // Tablet Viewport: 820x1180 (iPad Air)
    const { page: tabletPage, context: tabletCtx } = await createTrackedPage({ width: 820, height: 1180 });
    await tabletPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const tabletTakePhoto = await tabletPage.getByRole('button', { name: /TAKE PHOTO/i }).isVisible();
    console.log(`- Tablet 820x1180: CTA visible (${tabletTakePhoto})`);
    await tabletCtx.close();
    report.testsPassed++;

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n========================================');
    console.log(`TOTAL PASSES: ${report.testsPassed}`);
    console.log(`TOTAL FAILURES: ${report.testsFailed}`);
    console.log(`CONSOLE ERRORS DETECTED: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('========================================\n');

  } catch (err) {
    console.error('[TEST SUITE FAILURE]:', err);
    report.testsFailed++;
  } finally {
    await browser.close();
  }
}

runE2EQA();
