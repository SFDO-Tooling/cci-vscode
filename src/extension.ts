import {commands, window, ExtensionContext, OutputChannel } from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { Org, OrgDataProvider } from './OrgDataProvider';
import { Task, TaskDataProvider } from './TaskDataProvider';


// called on activation of extension
// see activationEvents in package.json
export function activate(context: ExtensionContext) {

    let output = initOutputChannel();
    output.appendLine('> CumulusCI extension activated');

    const orgDataProvider = new OrgDataProvider(output);
    const taskDataProvider = new TaskDataProvider(output);
    const flowDataProvider = new FlowDataProvider(output);

    // Register tree views
    window.registerTreeDataProvider("cciOrgView", orgDataProvider);
    window.registerTreeDataProvider("cciTaskView", taskDataProvider);
    window.registerTreeDataProvider("cciFlowView", flowDataProvider);
    //vscode.window.registerTreeDataProvider("cciCommandView", commandDataProvider);

    // Register commands
    commands.registerCommand('cci.refreshOrgs', () => orgDataProvider.refresh());
    commands.registerCommand('cci.refreshTasks', () => taskDataProvider.refresh());
    commands.registerCommand('cci.refreshFlows', () => flowDataProvider.refresh());

    commands.registerCommand('cci.runFlow', (flow: Flow) => {
        window.showInformationMessage(`Running Flow: ${flow.name}`);
    });
    commands.registerCommand('cci.runTask', (task: Task) => {
        window.showInformationMessage(`Running Task: ${task.name}`);
        window.showQuickPick(orgDataProvider.orgs, {});
        // TODO: Use Quick Pick API for org selection to run task against
        // TODO: Execute `cci flow run ${flow.name}` against selected org
    });
    commands.registerCommand('cci.openOrg', (org: Org) => {
        window.showInformationMessage(`Logging into org: ${org.name}`);
    });



}


// Create and return a channel that is visible to users
function initOutputChannel(): OutputChannel {
    const channel = window.createOutputChannel('CumulusCI');
    channel.show();
    return channel;
}


// called when the extension is deactivated
export function deactivate() { }
