const fs = require('fs');
const path = require('path');

// Log file path
const logDirPath = path.join(__dirname, '..', 'logs');
const logFilePath = path.join(logDirPath, 'test_logs.txt');

// Ensure the logs directory exists
if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true }); // Create logs directory if it doesn't exist
}

// Function to log messages
const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage); // Print log to console
    fs.appendFileSync(logFilePath, logMessage); // Write log to file
};

// Export the log function
module.exports = log;
