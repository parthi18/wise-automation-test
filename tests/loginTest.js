const { By, until } = require('selenium-webdriver');
const setupDriver = require('../utils/driverSetup');
const config = require('../config/config');
const log = require('../utils/logger');

async function loginTest() {
    let driver = await setupDriver();

    try {
        // Visit the Wise Staging Site
        console.log('Navigating to Wise Staging Site...');
        await driver.get(config.baseUrl);
        log('Visited the Wise staging site 1');

        // Login as Tutor
        console.log('Waiting for "Continue with Mobile" button...');
        await driver.wait(until.elementLocated(By.xpath("(//button[@type='button'])[3]")), 5000);
        await driver.findElement(By.xpath("(//button[@type='button'])[3]")).click();

        console.log('Test 1: Clicked on the continue button');

        // Wait for the phone input field to be located
        console.log('Waiting for phone input field...');
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Phone number']")), 5000);
        await driver.findElement(By.xpath("//input[@placeholder='Phone number']")).sendKeys(config.tutorPhone);

        console.log('Test 2: Entered phone number');

        // Get OTP and enter it
        console.log('Requesting OTP...');
        await driver.findElement(By.xpath("//span[normalize-space(text())='Get OTP']")).click();
        await driver.findElement(By.xpath("(//input[@type='number'])[1]")).sendKeys(config.otp);
        await driver.findElement(By.xpath("//button[contains(.,'Verify')]")).click();

        console.log('Test 3: OTP entered and verified');

        // Wait for the Institute Name to appear
        console.log('Waiting for the Institute Name...');
        await driver.wait(until.elementLocated(By.xpath("//span[contains(@class,'institute-title ml-2')]")), 5000);
        log('Logged in as Tutor');

        // Assert the Institute Name
        let instituteName = await driver.findElement(By.xpath("//span[contains(@class,'institute-title ml-2')]")).getText();
        if (instituteName !== config.instituteName) {
            throw new Error("Login Failed or Incorrect Institute");
        }
        log('Institute name verified successfully');

        console.log("Login Test Passed!");
    } catch (error) {
        console.error("Login Test Failed:", error);
        log(`Error: ${error.message}\nStack trace: ${error.stack}`);
    } finally {
        console.log('Closing the browser...');
        await driver.quit();
        log('Driver quit');
    }
}

loginTest();
