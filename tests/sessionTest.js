const { By, until, Key } = require('selenium-webdriver');
const setupDriver = require('../utils/driverSetup');
const config = require('../config/config');
const log = require('../utils/logger');

async function sessionTest() {
    // Helper function for getting element text if displayed
    async function getElementTextIfDisplayed(driver, xpath) {
        const element = await driver.findElement(By.xpath(xpath));
        if (await element.isDisplayed()) {
            return await element.getText();
        }
        return null;
    }

    let driver = await setupDriver();

    try {
        // Visit the Wise Staging Site
        await driver.get(config.baseUrl);
        log('Visited the Wise staging site');

        // Login as Tutor
        console.log('Waiting for "Continue with Mobile" button...');
        await driver.wait(until.elementLocated(By.xpath("(//button[@type='button'])[3]")), 5000);
        await driver.findElement(By.xpath("(//button[@type='button'])[3]")).click();
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Phone number']")), 5000);
        await driver.findElement(By.xpath("//input[@placeholder='Phone number']")).sendKeys(config.tutorPhone);
        await driver.findElement(By.xpath("//span[normalize-space(text())='Get OTP']")).click();
        await driver.findElement(By.xpath("(//input[@type='number'])[1]")).sendKeys(config.otp);
        await driver.findElement(By.xpath("//button[contains(.,'Verify')]")).click();
        log('Logged in as Tutor');

        // Navigate to Group Courses and select Classroom
        await driver.wait(until.elementLocated(By.xpath("(//a[contains(@class,'rounded-lg d-flex')]/following-sibling::a)[3]")), 5000);
        await driver.findElement(By.xpath("(//a[contains(@class,'rounded-lg d-flex')]/following-sibling::a)[3]")).click();
        await driver.wait(until.elementLocated(By.xpath("//a[normalize-space(text())='Classroom for Automated testing']")), 5000);
        await driver.findElement(By.xpath("//a[normalize-space(text())='Classroom for Automated testing']")).click();
        log('Navigated to Classroom for Automated testing');

        // Assert classroom opened successfully
        await driver.wait(until.elementLocated(By.xpath("(//div[@class='d-flex align-center']//div)[2]")), 5000);
        let classroomHeader = await driver.findElement(By.xpath("(//div[@class='d-flex align-center']//div)[2]")).getText();
        if (classroomHeader !== "Classroom for Automated testing") {
            throw new Error("Failed to open the correct classroom.");
        }
        log('Classroom opened successfully');

        // Schedule a Session
        await driver.sleep(3000);
        await driver.wait(until.elementLocated(By.xpath("//a[normalize-space(text())='Live Sessions']")), 5000);
        await driver.findElement(By.xpath("//a[normalize-space(text())='Live Sessions']")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Schedule Sessions')]")), 5000);
        await driver.findElement(By.xpath("//button[contains(.,'Schedule Sessions')]")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Add session')]")), 5000);
        await driver.findElement(By.xpath("//button[contains(.,'Add session')]")).click();
        log('Session creation page opened');

        // Select Time
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.xpath("//div[@class='v-select__slot']/input[@type='text']")), 5000);
        let timeInput = await driver.findElement(By.xpath("//div[@class='v-select__slot']/input[@type='text']"));
        await timeInput.click();
        await driver.sleep(1000);
        await timeInput.clear();
        await timeInput.sendKeys('10:00', Key.ENTER);

        let test = await driver.findElement(By.xpath("(//div[contains(@class,'pa-2 d-flex')])[2]")).getText();
        if (test !== "PM") {
            await driver.findElement(By.xpath("(//div[contains(@class,'pa-2 d-flex')])[2]")).click();
        }
        log('Session time set to 10:00 PM');

        // Create the session
        await driver.findElement(By.xpath("//button[contains(.,'Create')]")).click();
        await driver.wait(until.elementLocated(By.xpath("//div[@class='timeline js-track']")), 5000);
        log('Session created');

        // Assert session creation
        let sessionsCard = await driver.findElement(By.xpath("//div[@class='timeline js-track']"));
        if (await sessionsCard.isDisplayed()) {
            // Instructor Name
            let instructorName = await getElementTextIfDisplayed(driver, "//span[@class='mr-2']/following-sibling::div[1]");
            if (instructorName) {
                if (instructorName.trim() === "Wise Tester") {
                    log('Instructor name: ' + instructorName);
                } else {
                    log('Instructor name is incorrect: ' + instructorName);
                }
            } else {
                log('Instructor name element is not displayed');
            }

            // Session Name
            let sessionName = await getElementTextIfDisplayed(driver, "(//div[contains(@class,'heading py-10')]//div)[1]");
            if (sessionName) {
                if (sessionName.trim() === "Live session") {
                    log('Session name: ' + sessionName);
                } else {
                    log('Session name is incorrect: ' + sessionName);
                }
            } else {
                log('Session name element is not displayed');
            }

            // Session Time
            let sessionTime = await getElementTextIfDisplayed(driver, "(//div[@class='text--14 font-weight--500']/following-sibling::div)[1]");
            if (sessionTime) {
                let timePattern = /\d{2} [A-Za-z]{3} \d{2}, (\d{2}:\d{2} [APM]{2})/;
                let match = sessionTime.match(timePattern);
                if (match && match[1] === "10:00 PM") {
                    log('Session time: ' + match[1]);
                } else {
                    log('Session time is incorrect: ' + sessionTime);
                }
            } else {
                log('Session time element is not displayed');
            }

            // Upcoming Status
            let upcomingStatus = await getElementTextIfDisplayed(driver, "//span[contains(@class,'text--12 v-chip')]//span[1]");
            if (upcomingStatus) {
                log('Upcoming status: ' + upcomingStatus);
            } else {
                log('Upcoming status element is not displayed');
            }

        } else {
            log('Sessions Card is not created');
        }

    } catch (error) {
        console.error("Session Test Failed:", error);
        log(`Error: ${error.message}`);
    } finally {
        await driver.quit();
        log('Driver quit');
    }
}

sessionTest();
