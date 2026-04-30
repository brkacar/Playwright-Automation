const { test, expect } = require('@playwright/test');


test('Test with browser context', async ({ browser }) => {
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

test('Test with page', async ({ page }) => {
    await page.goto('https://google.com');
    //get title of the page
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
})

test.only('Test with register and login page', async ({ page }) => {
    const email = 'berkar@mailinator.com';
    const password = 'P@ssw0rd';

    await page.goto('https://rahulshettyacademy.com/client');
    await page.getByText("Register here").click();    
    await page.locator('#firstName').fill('Berk');
    await page.locator('#lastName').fill('Arc');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userMobile').fill('1234567890');
    await page.getByRole('combobox').selectOption('Engineer');
    await page.locator("input[value='Male']").check();
    await page.locator('#userPassword').fill(password);
    await page.locator('#confirmPassword').fill(password);    
    await page.locator("//input[@type='checkbox']").check();
    await page.locator('#login').click();
    await expect(page.locator(".headcolor")).toContainText('Account Created Successfully');
    
    await page.getByText("Login").click();
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('#login').click();
    console.log(await page.locator(".card-body b").first().textContent());


})