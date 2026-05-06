const { test, expect } = require('@playwright/test');




test('Initial Test with browser context', async ({ browser }) => {
    //chrome -plugins/cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    const usernameLocator = page.locator('#username');
    const passwordLocator = page.locator('#password');
    const signInLocator = page.locator('#signInBtn');
    const cardTitlesLocator = page.locator(".card-body a");

    //css, xpath, text, id, class
    await usernameLocator.fill('bbb');
    await passwordLocator.fill('Learning@830$3mK2');
    await signInLocator.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    //correct username
    console.log("Then Correct username test:");
    await usernameLocator.fill('rahulshettyacademy');
    await signInLocator.click();

    console.log(await cardTitlesLocator.first().textContent());
    console.log(await cardTitlesLocator.nth(1).textContent());
    const allTitles = await cardTitlesLocator.allTextContents(); //this does not have  wait. So if we delete above two lines this will bring empty array.
    console.log(allTitles);

})

test('Initial Test with page', async ({ page }) => {
    await page.goto('https://google.com');
    //get title of the page
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
})

test('UI Control with locators defined in the test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const usernameLocator = page.locator('#username');
    const passwordLocator = page.locator('#password');
    const signInLocator = page.locator('#signInBtn');
    const dropdownLocator = page.locator("select.form-control");
    const radioButtonLocator = page.locator(".radiotextsty");
    const popupLocator = page.locator("#okayBtn");
    const termsLocator = page.locator("#terms");
    const documentLink= page.locator("a[href*='documents-request']");

    await dropdownLocator.selectOption('consult');

    await radioButtonLocator.last().click();
    await popupLocator.click();
    //await page.pause();
    console.log(await radioButtonLocator.last().isChecked());
    await expect(radioButtonLocator.last()).toBeChecked(); 

    await termsLocator.click();
    await expect(termsLocator).toBeChecked();
    await termsLocator.uncheck();
    await expect(termsLocator).not.toBeChecked();
    // expect(await termsLocator.isChecked()).toBeFalsy();  //not preferred
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');

})


test('Child window handling', async ({ browser }) => {
    //chrome -plugins/cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink= page.locator("a[href*='documents-request']");
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click()
    ]);
    await newPage.waitForLoadState();
    
    const text = await newPage.locator(".red").textContent();
    console.log(text);
    const arrayText = text.split('@');
    const domain = arrayText[1].split(' ')[0];
    //console.log(domain);
    await page.locator('#username').fill(domain);  //in the first page
    console.log(await page.locator('#username').inputValue()); //to get the value of the input field

})




