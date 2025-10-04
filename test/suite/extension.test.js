const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {
  test('extension activates', async () => {
    const ext = vscode.extensions.getExtension('sashaweiss.bracket-jumper') || vscode.extensions.getExtension('bracket-jumper');
    assert.ok(ext, 'Extension not found in the test host');
    await ext.activate();
    assert.ok(ext.isActive, 'Extension failed to activate');
  }).timeout(20000);
});
