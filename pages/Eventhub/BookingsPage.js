import { expect } from '@playwright/test';
import eventsTestData from '../../test-data/events-data.json' with { type: 'json' };

const { EVENT_BASE_URL } = eventsTestData;

export class BookingsPage {
  constructor(page) {
    this.page = page;
    this.url = `${EVENT_BASE_URL}/bookings`;
    this.ticketCount = page.locator('#ticket-count');
    this.fullNameInput = page.getByLabel('Full Name');
    this.emailInput = page.locator('#customer-email');
    this.phoneInput = page.getByPlaceholder('+91 98765 43210');
    this.confirmBookingButton = page.locator('.confirm-booking-btn');
    this.bookingRefElement = page.locator('.booking-ref').first();
    this.bookingCard = page.locator('#booking-card');
  }

  async expectBookingFormIsReady() {
    await expect(this.ticketCount).toHaveText('1');
  }

  async fillBookingForm({ fullName, email, phone }) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async submitBooking() {
    await this.confirmBookingButton.click();
  }

  async getBookingRef() {
    await expect(this.bookingRefElement).toBeVisible();
    return (await this.bookingRefElement.textContent()).trim();
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async verifyBookingExists(title, bookingRef) {
    const bookingCard = this.bookingCard.filter({ hasText: bookingRef });
    await expect(bookingCard).toBeVisible();
    await expect(bookingCard.getByRole('heading')).toHaveText(title);
  }

  async expectOnBookingsPage() {
    await expect(this.page).toHaveURL(this.url);
  }
}
