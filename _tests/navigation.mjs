import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseURL = process.env.SITE_URL || "http://127.0.0.1:4173";
const screenshots = path.join(process.env.RUNNER_TEMP || ".navigation-artifacts", "navigation-screenshots");
await mkdir(screenshots, { recursive: true });

for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const response = await fetch(baseURL, { signal: AbortSignal.timeout(1000) });
    if (response.ok) break;
    throw new Error(`Preview returned ${response.status}`);
  } catch (error) {
    if (attempt === 29) throw error;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

// GitHub-hosted Ubuntu runners include stable Google Chrome.
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
page.setDefaultTimeout(15000);

async function checkVisibleLabels() {
  const issues = await page.locator("#navbar").evaluate((nav) => {
    const errors = [];
    for (const link of nav.querySelectorAll(".navbar-brand, .nav-link")) {
      const rect = link.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const label = link.textContent.replace("(current)", "").trim();
      if (rect.left < -1 || rect.right > window.innerWidth + 1) errors.push(`${label}: outside viewport`);
      const lines = new Set();
      for (const node of link.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const line of range.getClientRects()) {
          if (line.width > 0) lines.add(Math.round(line.top));
        }
      }
      if (lines.size > 1) errors.push(`${label}: wraps across ${lines.size} lines`);
    }
    if (nav.scrollWidth > nav.clientWidth + 1) errors.push("navigation overflows horizontally");
    return errors;
  });
  assert.deepEqual(issues, [], `${page.url()}: ${issues.join("; ")}`);
}

try {
  for (const route of ["/", "/gallery/", "/teaching/", "/publications/"]) {
    for (const width of [320, 375, 768, 850, 1024, 1199, 1200, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(baseURL + route, { waitUntil: "load" });
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      const toggler = page.getByRole("button", { name: "Toggle navigation" });
      const teaching = page.locator('#navbar a[href="/teaching/"]');
      const collapsed = await toggler.isVisible();
      assert.equal(collapsed, width < 1200, `Unexpected menu mode at ${width}px`);
      assert.equal(await teaching.isVisible(), !collapsed);

      if (collapsed) {
        await toggler.click();
        await teaching.waitFor({ state: "visible" });
        await page.waitForFunction(() => document.querySelector("#navbarNav").classList.contains("show"));
      }
      await checkVisibleLabels();

      if (route === "/gallery/" && [375, 850, 1200, 1440].includes(width)) {
        await page.screenshot({ path: path.join(screenshots, `gallery-${width}${collapsed ? "-open" : ""}.png`) });
      }

      if (route === "/gallery/" && [375, 850, 1200].includes(width)) {
        for (const dropdown of await page.locator("#navbar .dropdown-toggle").all()) {
          await dropdown.click();
          const menu = page.locator("#navbar .dropdown-menu.show");
          await menu.waitFor({ state: "visible" });
          assert.ok(await menu.locator("a.dropdown-item").first().isVisible());
          await dropdown.click();
          await menu.waitFor({ state: "hidden" });
        }
      }

      if (collapsed) {
        await toggler.click();
        await teaching.waitFor({ state: "hidden" });
        await page.waitForFunction(() => !document.querySelector("#navbarNav").classList.contains("collapsing"));
      }
      const height = await page.locator("#navbar").evaluate((nav) => nav.getBoundingClientRect().height);
      assert.ok(height <= 64, `Closed navigation is ${height}px tall at ${width}px`);
      if (["/", "/gallery/", "/teaching/"].includes(route) && [375, 850, 1440].includes(width)) {
        await page.screenshot({ path: path.join(screenshots, `${route.split("/")[1] || "home"}-${width}.png`) });
      }
      console.log(`PASS ${route} at ${width}px: single-line labels, contained navigation, menu ${collapsed ? "opens/closes" : "expanded"}`);
    }
  }

  await page.setViewportSize({ width: 850, height: 900 });
  await page.goto(baseURL + "/gallery/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.locator('#navbar a[href="/teaching/"]').click();
  await page.waitForURL(baseURL + "/teaching/");
  assert.equal((await page.locator("h1").innerText()).trim(), "Teaching & Service");
  console.log("PASS navigation to Teaching & Service");

  await page.setViewportSize({ width: 850, height: 360 });
  await page.goto(baseURL + "/gallery/", { waitUntil: "load" });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.waitForFunction(() => document.querySelector("#navbarNav").classList.contains("show"));
  await page.locator("#navbar .dropdown-toggle").last().click();
  const lastItem = page.locator("#navbar .dropdown-menu.show .dropdown-item").last();
  await lastItem.scrollIntoViewIfNeeded();
  const itemRect = await lastItem.boundingBox();
  assert.ok(itemRect.y >= 0 && itemRect.y + itemRect.height <= 361, "Landscape submenu must remain reachable");
  await page.locator("#light-toggle").scrollIntoViewIfNeeded();
  const toggleRect = await page.locator("#light-toggle").boundingBox();
  assert.ok(toggleRect.y + toggleRect.height <= 361, "Bottom navigation control must remain reachable");
  await page.screenshot({ path: path.join(screenshots, "gallery-landscape-open.png") });
  console.log("PASS short landscape menu scrolling");

  await page.setViewportSize({ width: 850, height: 900 });
  await page.goto(baseURL + "/gallery/", { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#progress").hasAttribute("max"));
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.waitForFunction(() => document.querySelector("#navbarNav").classList.contains("show"));
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.waitForFunction(() => !document.querySelector("#navbarNav").classList.contains("collapsing"));
  await page.waitForFunction(() => {
    const height = document.querySelector("#navbar").getBoundingClientRect().height;
    return Math.abs(parseFloat(getComputedStyle(document.body).paddingTop) - height) <= 1;
  });
  console.log("PASS content offset after resizing and closing the menu");
} catch (error) {
  await page.screenshot({ path: path.join(screenshots, "failure.png") });
  throw error;
} finally {
  await browser.close();
}
