const path = require('path');
const Mocha = require('mocha');

function run() {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testDir = __dirname;

  mocha.addFile(path.join(testDir, 'extension.test.js'));

  return new Promise((resolve, reject) => {
    try {
      mocha.run(failures => {
        if (failures) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { run };

if (require.main === module) {
  run().then(() => process.exit(0)).catch(() => process.exit(1));
}
