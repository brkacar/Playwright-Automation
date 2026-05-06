import { expect } from '@playwright/test';
import eventsTestData from '../../test-data/events-data.json' with { type: 'json' };

const { EVENT_BASE_URL } = eventsTestData;

export class AdminEventsPage {
  constructor(page) {
    this.page = page;
    this.url = `${EVENT_BASE_URL}/admin/events`;
    this.titleInput = page.locator('#event-title-input');
    this.descriptionTextarea = page.locator('#admin-event-form textarea');
    this.cityInput = page.getByLabel('City');
    this.venueInput = page.getByLabel('Venue');
    this.dateInput = page.getByLabel('Event Date & Time');
    this.priceInput = page.getByLabel('Price ($)');
    this.totalSeatsInput = page.getByLabel('Total Seats');
    this.addEventButton = page.locator('#add-event-btn');
    this.eventCreatedMessage = page.getByText('Event created!');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async createEvent({ title, description, city, venue, date, price, seats }) {
    await this.goto();
    await this.titleInput.fill(title);
    await this.descriptionTextarea.fill(description);
    await this.cityInput.fill(city);
    await this.venueInput.fill(venue);
    await this.dateInput.fill(date);
    await this.priceInput.fill(price);
    await this.totalSeatsInput.fill(seats);
    await this.addEventButton.click();
    await expect(this.eventCreatedMessage).toBeVisible();
  }
}
