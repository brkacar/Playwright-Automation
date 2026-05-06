import { test, expect } from '@playwright/test';
const { APIUtils } = require('../utils/APIUtils');
const SIX_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
        { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
        { id: 6, title: 'AI & ML Expo', category: 'Conference', eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};
const FOUR_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};


const eventURL = 'https://eventhub.rahulshettyacademy.com';

test.describe('Event Interceptions', () => {
  test('6 Event Interception', async ({ page }) => {
    await page.route('**/api/events*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: SIX_EVENTS_RESPONSE
      });
    });

    await loginAndGoToEvents(page);

    const events = page.locator('[data-testid="event-card"]');
    await expect(events).toHaveCount(6);
    await expect(events.first()).toBeVisible();
  
    await expect(page.getByText(/sandbox holds up to/i)).toBeVisible();
     await expect(page.getByText(/sandbox holds up to/i)).toContainText("9 bookings")
});

  test('4 Event Interception', async ({ page }) => {
    await page.route('**/api/events*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: FOUR_EVENTS_RESPONSE
      });
    });

    await loginAndGoToEvents(page);

    const events = page.locator('[data-testid="event-card"]');
    await expect(events).toHaveCount(4);
    await expect(events.first()).toBeVisible();

    await expect(page.getByText(/sandbox holds up to/i)).not.toBeVisible();
    
  });

  async function loginAndGoToEvents(page) {
    await page.goto(`${eventURL}/login`);
    await page.getByPlaceholder('you@email.com').fill('berkacar@mailinator.com');
    await page.getByLabel('Password').fill('P@ssw0rd');
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    await page.goto(`${eventURL}/events`);
  }
});