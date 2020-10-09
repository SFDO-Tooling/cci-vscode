import * as path from 'path';
import * as vscode from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { Org, OrgDataProvider } from './OrgDataProvider';
import { Task, TaskDataProvider } from './TaskDataProvider';


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

    vscode.commands.registerCommand('cci.runFlow', (flow: Flow) => {
        vscode.window.showInformationMessage(`Running Flow: ${flow.name}`);
        // TODO: Open popup window and let user select which org they want to run flow against
        // TODO: Execute `cci flow run ${flow.name} 
    });
    vscode.commands.registerCommand('cci.runTask', (task: Task) => {
        vscode.window.showInformationMessage(`Running Task: ${task.name}`);
    });
    vscode.commands.registerCommand('cci.openOrg', (org: Org) => {
        vscode.window.showInformationMessage(`Logging into org: ${org.name}`);
    });



}


// Create and return a channel that is visible to users
function initOutputChannel(): vscode.OutputChannel {
    const channel = vscode.window.createOutputChannel('CumulusCI');
    channel.show();
    return channel;
}


// called when the extension is deactivated
export function deactivate() { }
