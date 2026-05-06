const { test, expect, request } = require("@playwright/test");

let token;
let orderId;

const email = 'berkar@mailinator.com';
const password = 'P@ssw0rd';
const productName = 'ZARA COAT 3';
let savedContext;

test.beforeAll(async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/client');

    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator(".card-body b").first().waitFor();
    await context.storageState({ path: 'state.json' })
    savedContext = await browser.newContext({ storageState: 'state.json' })

});

test.describe("Placing order tests with 1 UI login", async () => {

    test('Test show all titles using saved context', async () => {

        const page = await savedContext.newPage();
        await page.goto('/client');
        const titles = await page.locator(".card-body b").allTextContents();
        console.log(titles);

    });

    test('Test Place Order using saved context', async () => {

        const page = await savedContext.newPage();
        await page.goto('/client');
        const products = page.locator(".card-body");
        const count = await products.count();

        for (let i = 0; i < count; ++i) {
            if (await products.nth(i).locator("b").textContent() === productName) {

                await products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }

        await page.locator("[routerlink*='cart']").click();
        await page.locator("div li").first().waitFor();

        const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
        expect(await bool).toBeTruthy();

        await page.locator("text=Checkout").click();
        await page.locator("[placeholder*='Country']").pressSequentially("ita", { delay: 100 });
        const dropdown = page.locator(".ta-results");
        await dropdown.waitFor();
        const optionsCount = await dropdown.locator("button").count();
        for (let i = 0; i < optionsCount; ++i) {
            const text = await dropdown.locator("button").nth(i).textContent();
            if (text === " Italy") {
                await dropdown.locator("button").nth(i).click();
                break;
            }

        };
        await expect(page.locator(".user__name label")).toHaveText(email);
        await page.locator(".action__submit").click();
        await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

        const text = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
        const orderId = text.split("|")[1].trim();
        console.log(orderId);

        //await page.goto('/client');

        await page.getByRole("button", { name: "ORDERS" }).click();
        await page.getByText("Your Orders").waitFor();
        const rows = await page.locator("tbody tr");


        await rows.filter({ hasText: orderId }).getByRole("button", { name: "View" }).click();

        const orderIdDetails = await page.locator(".col-text").textContent();
        expect(orderId.includes(orderIdDetails)).toBeTruthy();

    });

}

);

