import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../pages/Eventhub/LoginPage.js';
import { AdminEventsPage } from '../pages/Eventhub/AdminEventsPage.js';
import { EventsPage } from '../pages/Eventhub/EventsPage.js';
import { BookingsPage } from '../pages/Eventhub/BookingsPage.js';
import { EventHub } from '../test-data/credentials.js';




test('Event Creation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const adminEventsPage = new AdminEventsPage(page);
  const eventsPage = new EventsPage(page);
  const bookingsPage = new BookingsPage(page);

  const title = `${faker.lorem.words(3)} created on ${new Date().toLocaleDateString()}`;

  // Generate fake event data
  const eventData = {
    description: faker.lorem.sentence(),
    city: faker.location.city(),
    venue: faker.lorem.word(),
    date: faker.date.future().toISOString().slice(0, 16),
    price: faker.number.int({ min: 10, max: 500 }).toString(),
    seats: faker.number.int({ min: 10, max: 100 }).toString(),
  };

  // Generate fake customer data
  const customerData = {
    fullName: faker.person.fullName(),
    email: faker.internet.email().replace(/@.*/, '@mailinator.com'),
    phone: faker.phone.number('+91 ##### #####'),
  };

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
