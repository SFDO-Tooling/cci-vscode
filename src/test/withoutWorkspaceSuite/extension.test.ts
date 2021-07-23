import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { OrgDataProvider } from '../../OrgDataProvider';
// import * as myExtension from '../extension';

suite('Without active workspace', () => {
        test('Extension is activated', () => {
                const extension = vscode.extensions.getExtension('CumulusCI.cci');
                assert.strictEqual(extension?.isActive, true);
        });

        test('OrgDataProvider initializes with no orgs', () => {
                const channel = vscode.window.createOutputChannel('test');
                const odp = new OrgDataProvider(channel);
                assert.strictEqual(odp.orgs.length, 0);
        });
        
        test('OrgDataProvider returns null', () => {
                const channel = vscode.window.createOutputChannel('test');
                const odp = new OrgDataProvider(channel);
                // fetch the root node, which will return all orgs
                const orgNodes = odp.getChildren(undefined);
                assert.strictEqual(orgNodes, null);
        });
});
