import { test, expect } from '@playwright/test';
import path from 'node:path';

const pageUrl = 'file://' + path.resolve(__dirname, '../index.html');

const heroHeading = 'Carbon accounting & sustainability partners for ambitious teams';

const sections = [
  { id: '#services', heading: 'Carbon accounting expertise' },
  { id: '#products', heading: 'Empower sustainability with our platforms' },
  { id: '#about', heading: 'Guided by purpose' },
  { id: '#approach', heading: 'How we deliver measurable sustainability' },
  { id: '#faq', heading: 'Questions we answer every week' },
  { id: '#contact', heading: 'Launch your sustainability journey today' },
];

test.beforeEach(async ({ page }) => {
  await page.goto(pageUrl);
});

test('hero renders headline, pitch, and CTAs', async ({ page }) => {
  await expect(page).toHaveTitle(/Cropship \| Carbon Accounting/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(heroHeading);
  await expect(page.getByRole('link', { name: 'Get in touch' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore services' })).toBeVisible();
});

for (const section of sections) {
  test(`section ${section.id} is visible with heading`, async ({ page }) => {
    const locator = page.locator(section.id);
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await expect(locator.getByRole('heading', { name: section.heading })).toBeVisible();
  });
}

test('services checklist and cards render expected content', async ({ page }) => {
  const section = page.locator('#services');
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('.checklist li')).toHaveCount(4);
  await expect(section.getByRole('heading', { name: 'Event decarbonisation' })).toBeVisible();
  await expect(section.getByRole('heading', { name: 'Product lifecycle assessments' })).toBeVisible();
  await expect(section.getByRole('heading', { name: 'Service & digital emissions' })).toBeVisible();
});

test('approach cards and FAQ accordions work', async ({ page }) => {
  await page.locator('#approach').scrollIntoViewIfNeeded();
  await expect(page.locator('.approach-card')).toHaveCount(3);

  await page.locator('#faq').scrollIntoViewIfNeeded();
  const faq = page.locator('#faq details').first();
  await faq.click();
  await expect(faq.locator('p')).toContainText('6–8 weeks');
});

test('contact methods include mailto, tel, and LinkedIn', async ({ page }) => {
  const contact = page.locator('#contact');
  await contact.scrollIntoViewIfNeeded();
  await expect(contact.getByRole('link', { name: 'hello@cropship.earth' })).toHaveAttribute('href', /mailto:hello@cropship\.earth/);
  await expect(contact.getByRole('link', { name: 'Connect on LinkedIn' })).toHaveAttribute('href', /linkedin\.com\/company\/cropship/);
});
