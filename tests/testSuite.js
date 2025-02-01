const { exec } = require('child_process');

const runTest = (testFile) => {
    return new Promise((resolve, reject) => {
        exec(`node ${testFile}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error executing ${testFile}: ${err.message}`);
                reject(err);
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
};

const runTestsSequentially = async () => {
    try {
        await runTest('tests/loginTest.js');   // Run login test first
        console.log("Login test completed. Running session test...");
        await runTest('tests/sessionTest.js'); // Run session test next
        console.log("Session test completed.");
    } catch (error) {
        console.error("Test execution stopped due to an error.");
    }
};

runTestsSequentially();
