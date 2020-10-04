import * as path from 'path';
import * as vscode from 'vscode';
import { FlowDataProvider } from './FlowDataProvider';


// called on activation of extension
// see activationEvents in package.json
export function activate(context: vscode.ExtensionContext) {

    let output = initOutputChannel();
    output.appendLine('CumulusCI extension activated');

    // Register tree views
    vscode.window.registerTreeDataProvider("cciOrgView", new FlowDataProvider());
    vscode.window.registerTreeDataProvider("cciTaskView", new FlowDataProvider());
    vscode.window.registerTreeDataProvider("cciFlowView", new FlowDataProvider());
}


// Create and return a channel that is visible to users
function initOutputChannel(): vscode.OutputChannel {
    const channel = vscode.window.createOutputChannel('CumulusCI');
    channel.show();
    return channel;
}


// called when the extension is deactivated
export function deactivate() {}
