const path = require('path');
const { runTests } = require('@vscode/test-electron');

// Read version from env or --version argument
function getArgVersion() {
  const arg = process.argv.find(a => a.startsWith('--version='));
  if (arg) return arg.split('=')[1];
  return process.env.VSCODE_VERSION || 'stable';
}

async function main() {
  try {
    const version = getArgVersion();
    console.log('Using VS Code version:', version);

    const extensionDevelopmentPath = path.resolve(__dirname, '..');
    const extensionTestsPath = path.resolve(__dirname, 'suite');

    await runTests({
      version,
      extensionDevelopmentPath,
      extensionTestsPath
    });
  } catch (err) {
    console.error('Failed to run tests:', err);
    process.exit(1);
  }
}

main();
