import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Eventhub/LoginPage.js';
import { AdminEventsPage } from '../pages/Eventhub/AdminEventsPage.js';
import { EventsPage } from '../pages/Eventhub/EventsPage.js';
import { BookingsPage } from '../pages/Eventhub/BookingsPage.js';
import { EventHub } from '../test-data/credentials.js';
import eventsTestData from '../test-data/events-data.json' with { type: 'json' };

const { eventData, customerData } = eventsTestData;

test('Event Creation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const adminEventsPage = new AdminEventsPage(page);
  const eventsPage = new EventsPage(page);
  const bookingsPage = new BookingsPage(page);

  const title = `QA Event Created ${new Date().toLocaleString()}`;

  await loginPage.login(EventHub.username, EventHub.password);

  await adminEventsPage.createEvent({
    title,
    description: eventData.description,
    city: eventData.city,
    venue: eventData.venue,
    date: eventData.date,
    price: eventData.price,
    seats: eventData.seats,
  });

  await eventsPage.goto();
  await eventsPage.expectEventVisible(title);

  const seatsBeforeBooking = await eventsPage.getSeatsAvailable(title);
  expect(seatsBeforeBooking).toEqual(parseInt(eventData.seats, 10));

  await eventsPage.bookEvent(title);

  await bookingsPage.expectBookingFormIsReady();
  await bookingsPage.fillBookingForm(customerData);
  await bookingsPage.submitBooking();

  const bookingRef = await bookingsPage.getBookingRef();

  await eventsPage.goToMyBookings();
  await bookingsPage.expectOnBookingsPage();
  await bookingsPage.verifyBookingExists(title, bookingRef);

  await eventsPage.goto();
  const seatsAfterBooking = await eventsPage.getSeatsAvailable(title);
  expect(seatsAfterBooking).toEqual(seatsBeforeBooking - 1);
});
