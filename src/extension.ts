import {commands, window, ExtensionContext, OutputChannel, workspace } from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { Org, OrgDataProvider } from './OrgDataProvider';
import showOrgQuickPick from './OrgQuickPick';
import showFlowQuickPick from './FlowQuickPick';


export function activate(context: ExtensionContext) {
    let channel = window.createOutputChannel('CumulusCI');
    let terminal = window.createTerminal('CumulusCI');

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
        showOrgQuickPick(org, terminal);
    });
    commands.registerCommand('cci.runFlow', (flow: Flow) => {
        showFlowQuickPick(flow, orgDataProvider.orgs, terminal);
    });
}

// called when the extension is deactivated
export function deactivate() {
    // TODO: terminal.dispose();
}
