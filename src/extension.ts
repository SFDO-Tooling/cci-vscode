import * as path from 'path';
import * as vscode from 'vscode';
import { FlowDataProvider } from './FlowDataProvider';
import { OrgDataProvider } from './OrgDataProvider';
import { TaskDataProvider } from './TaskDataProvider';


// called on activation of extension
// see activationEvents in package.json
export function activate(context: vscode.ExtensionContext) {

    let output = initOutputChannel();
    output.appendLine('CumulusCI extension activated');

    const orgDataProvider = new OrgDataProvider(output);
    const taskDataProvider = new TaskDataProvider(output);
    const flowDataProvider = new FlowDataProvider(output);

    // Register tree views
    vscode.window.registerTreeDataProvider("cciOrgView", orgDataProvider);
    vscode.window.registerTreeDataProvider("cciTaskView", taskDataProvider);
    vscode.window.registerTreeDataProvider("cciFlowView", flowDataProvider);

    // Register commands
    vscode.commands.registerCommand('cci.refreshOrgs', () => orgDataProvider.refresh());
    vscode.commands.registerCommand('cci.refreshTasks', () => taskDataProvider.refresh());
    vscode.commands.registerCommand('cci.refreshFlows', () => flowDataProvider.refresh());
}


// Create and return a channel that is visible to users
function initOutputChannel(): vscode.OutputChannel {
    const channel = vscode.window.createOutputChannel('CumulusCI');
    channel.show();
    return channel;
}


// called when the extension is deactivated
export function deactivate() { }
