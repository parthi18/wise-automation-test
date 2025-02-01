// driverSetup.js
const { Builder } = require('selenium-webdriver');
require('chromedriver');

const setupDriver = async () => {
    let driver = await new Builder().forBrowser('chrome').build();
    // Maximize the browser window
    await driver.manage().window().maximize();

    // Set implicit wait of 90 seconds
    await driver.manage().setTimeouts({ implicit: 90000 });

    return driver;
};

module.exports = setupDriver;
