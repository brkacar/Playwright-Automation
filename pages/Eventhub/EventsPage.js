import { expect } from '@playwright/test';
import eventsTestData from '../../test-data/events-data.json' with { type: 'json' };

const { EVENT_BASE_URL } = eventsTestData;

export class EventsPage {
  constructor(page) {
    this.page = page;
    this.url = `${EVENT_BASE_URL}/events`;
    this.eventCards = page.locator('[data-testid="event-card"]');
    this.myBookingsLink = page.getByRole('link', { name: 'View  My Bookings' });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  eventCardByTitle(title) {
    return this.eventCards.filter({ hasText: title });
  }

  async expectEventVisible(title) {
    await expect(this.eventCards.first()).toBeVisible();
    await expect(this.eventCardByTitle(title)).toBeVisible({ timeout: 5000 });
  }

  async getSeatsAvailable(title) {
    const seatsText = await this.eventCardByTitle(title).getByText(/seats available$/).textContent();
    return parseInt(seatsText.split(' ')[0].trim());
  }

  async bookEvent(title) {
    await this.eventCardByTitle(title).locator('[data-testid="book-now-btn"]').click();
  }

  async goToMyBookings() {
    await this.myBookingsLink.click();
  }
}
