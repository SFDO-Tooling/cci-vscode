import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { OrgDataProvider } from '../../OrgDataProvider';
// import * as myExtension from '../extension';

suite('With active workspace', () => {
        test('Extension is activated', () => {
                const extension = vscode.extensions.getExtension('CumulusCI.cci');
                assert.strictEqual(extension?.isActive, true);
        });


        test('OrgDataProvider returns expected orgs', async () => {
                const channel = vscode.window.createOutputChannel('test');
                const orgDataProvider = new OrgDataProvider(channel);
                // fetch the root node, which will return all orgs
                const orgNodes = await orgDataProvider.getChildren(undefined);
                assert.strictEqual(orgNodes?.length, 8);
        });
});
