const { test, expect } = require("@playwright/test");

test("Hide and Show Elements, Accept Dismiss Popups, Iframes", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#show-textbox").click();
    await expect(page.locator("#displayed-text")).toBeVisible();

    //accept  in case of dismiss, use dialog.dismiss()
    // page.on("dialog", dialog => dialog.accept()); //is same as below just without console log

    page.on("dialog", dialog => {
        console.log(dialog.message());
        dialog.accept();
    });
    await page.locator("#confirmbtn").click();

    //hover
    await page.locator("#mousehover").hover();

    //iframe
    const iframePage = page.frameLocator("#courses-iframe");
    await iframePage.locator("li [href*='lifetime-access']:visible").click();
    const text = await iframePage.locator(".text h2").textContent();
    console.log(text.split(" ")[1]);

});

test("Screenshot & Visual comparision", async ({ page }) => {
  await page.goto("/AutomationPractice/");
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#displayed-text").screenshot();
  await page.locator("#hide-textbox").click();
  await page.screenshot({ path: 'screenshot.png' });
  await expect(page.locator("#displayed-text")).toBeHidden();
});

//screenshot -store -> screenshot ->
test.only('visual', async ({ page }) => {
  await page.goto("https://yandex.com/");
  expect(await page.screenshot()).toMatchSnapshot('landing.png');
});
