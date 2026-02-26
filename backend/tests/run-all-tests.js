const { exec } = require('child_process');
const path = require('path');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const tests = [
  'test-db.js',
  'test-register.js',
  'test-login.js',
  'test-admin-login.js',
  'test-products.js',
  'test-profile.js'
];

const runTest = (testFile) => {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning ${testFile}...`);
    console.log('=' . repeat(50));
    
    const testPath = path.join(__dirname, testFile);
    const child = exec(`node "${testPath}"`, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      if (error) {
        console.error(`Error in ${testFile}:`, error.message);
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const runAllTests = async () => {
  console.log('Starting all tests...\n');
  
  for (const test of tests) {
    try {
      await runTest(test);
    } catch (error) {
      console.error(`Test ${test} failed to run`);
    }
  }
  
  console.log('\nAll tests completed!');
};

runAllTests();