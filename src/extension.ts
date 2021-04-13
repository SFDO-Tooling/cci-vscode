import {commands, window, ExtensionContext, OutputChannel } from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { Org, OrgDataProvider } from './OrgDataProvider';
import showOrgQuickPick from './OrgQuickPick';
import showFlowQuickPick from './FlowQuickPick';


// called on activation of extension
// see activationEvents in package.json
export function activate(context: ExtensionContext) {
    let channel = initOutputChannel();
    channel.appendLine('CumulusCI extension activated');

    // Data Providers
    const orgDataProvider = new OrgDataProvider(channel);
    const flowDataProvider = new FlowDataProvider(channel);

    // Register Tree Views
    window.registerTreeDataProvider("cciOrgView", orgDataProvider);
    window.registerTreeDataProvider("cciFlowView", flowDataProvider);

    // Commands
    commands.registerCommand('cci.refreshOrgs', () => orgDataProvider.refresh());
    commands.registerCommand('cci.refreshFlows', () => flowDataProvider.refresh());
    commands.registerCommand('cci.orgOperations', (org: Org) => {
        showOrgQuickPick(org, channel);
    });
    commands.registerCommand('cci.runFlow', (flow: Flow) => {
        showFlowQuickPick(flow, orgDataProvider.orgs, channel);
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
