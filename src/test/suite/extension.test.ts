import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

suite('Main', () => {
        test('Extension is activated', () => {
                const extension = vscode.extensions.getExtension('undefined_publisher.cci');
                assert.strictEqual(extension?.isActive, true);
        });
});
