import {commands, window, ExtensionContext, OutputChannel } from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { Org, OrgDataProvider } from './OrgDataProvider';
import showOrgQuickPick from './OrgQuickPick';


// called on activation of extension
// see activationEvents in package.json
export function activate(context: ExtensionContext) {

    let output = initOutputChannel();
    output.appendLine('> CumulusCI extension activated');


    const orgDataProvider = new OrgDataProvider(output);
    const flowDataProvider = new FlowDataProvider(output);

    // Register tree views
    window.registerTreeDataProvider("cciOrgView", orgDataProvider);
    window.registerTreeDataProvider("cciFlowView", flowDataProvider);
    //vscode.window.registerTreeDataProvider("cciCommandView", commandDataProvider);

    // Register commands
    commands.registerCommand('cci.refreshOrgs', () => orgDataProvider.refresh());
    commands.registerCommand('cci.refreshFlows', () => flowDataProvider.refresh());

    commands.registerCommand('cci.runFlow', (flow: Flow) => {
        window.showInformationMessage(`Running Flow: ${flow.name}`);
    });
    commands.registerCommand('cci.orgOperations', (org: Org) => {
        showOrgQuickPick(org, output);
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
