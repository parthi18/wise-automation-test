# Wise Automation Test

This project is a set of Selenium WebDriver-based automation tests using Node.js. The tests automate logging into a staging site for Wise and scheduling sessions for a tutor. This also includes enhancements to handle errors like duplicate session creation and popups that appear during testing.

## Project Overview

This automation test suite ensures the stability of Wise's scheduling and login functionalities. It verifies tutor login, session creation, error handling for duplicate sessions, and unexpected popups. The suite is designed to be run locally or in a CI/CD environment with headless execution.

## Prerequisites

Before running the tests, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v16.0.0 or higher)
- [Google Chrome](https://www.google.com/chrome/)
- [ChromeDriver](https://sites.google.com/chromium.org/driver/) - The version should match your Chrome version

## Installation

### Step 1: Clone the repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/wise-automation-test.git
cd wise-automation-test
```

### Step 2: Install dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

This will install the necessary Node.js packages, including Selenium WebDriver and ChromeDriver.

### Step 3: Update the configuration

Before running the tests, make sure to configure your settings in `config/config.js`. You should set the following values:

- `baseUrl`: The URL of the staging site you wish to test.
- `tutorPhone`: The phone number the tutor can use during login.
- `OTP`: The one-time password (OTP) used to authenticate the tutor.
- `instituteName`: The expected institute name after successful login.

Example `config/config.js`:

```js
module.exports = {
    baseUrl: 'https://staging-web.wise.live',
    tutorPhone: '1111100000',
    OTP: '0000',
    instituteName: 'Testing Institute'
};
```

## Running the Tests

Once you have updated the configuration, you can run the tests with the following command:

```bash
node tests/loginTest.js
```

Alternatively, you can run all the tests by executing the test suite:

```bash
node tests/testSuite.js
```

### Expected Test Results

- **Success:** Test passes with a confirmation message and logs stored in `logs/test_logs.txt`.
- **Failure:** Errors will be logged in `logs/test_logs.txt`, and appropriate messages will be displayed in the console.

## Handling Session Creation Errors

To avoid errors when scheduling a session on a date that already has a session, we added error handling in the session scheduling process. If a session already exists on the scheduled date, an error will be logged.

## Handling Unexpected Popups

We have handled unexpected popups during session scheduling by adding a mechanism to detect and close popups when they appear, ensuring the test continues running smoothly.

## Folder Structure

```
wise-automation-test/
│
├── tests/                  # Test scripts
│   ├── loginTest.js        # Login functionality test
│   ├── sessionTest.js      # Session scheduling functionality test
│   └── testSuite.js        # Suite to run multiple tests
│
├── utils/                  # Helper modules
│   ├── driverSetup.js      # Driver setup for Selenium WebDriver
│   ├── logger.js           # Logging utility
│   └── popupHandler.js     # Utility for handling unexpected popups
│
├── config/                 # Configuration file for test settings
│   └── config.js           # Base URL, tutor phone, OTP, and institute name
│
├── logs/                   # Log files
│   └── test_logs.txt       # Test run logs
│
└── package.json            # Project metadata and dependencies
```

## Running in Headless Mode

To run the tests in headless mode (without opening the browser UI), modify `driverSetup.js` to include the headless option:

```js
const { Builder } = require('selenium-webdriver');
require('chromedriver');

const setupDriver = async () => {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu'); // Disable GPU acceleration
    options.addArguments('--no-sandbox'); // Disable sandbox for Linux environments
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    return driver;
};

module.exports = setupDriver;
```

To run the tests headlessly, simply run the test as shown earlier:

```bash
node tests/loginTest.js
```

## Logging

Logs are written both to the console and to a file (`logs/test_logs.txt`). The logging utility has been enhanced to log specific errors such as session creation failures or unexpected popups.

To view logs, use:

```bash
cat logs/test_logs.txt
```

## CI/CD Integration (Optional)

These tests can be integrated with a CI/CD pipeline like GitHub Actions. To run the tests in CI, use the following command:

```bash
npm test
```

## Contributing

We welcome contributions! If you have improvements or bug fixes, feel free to submit a pull request.
