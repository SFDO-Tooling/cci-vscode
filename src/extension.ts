import {commands, window, ExtensionContext, OutputChannel, workspace } from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { OrgNode, OrgDataProvider } from './OrgDataProvider';
import showOrgQuickPick from './OrgQuickPick';
import showFlowQuickPick from './FlowQuickPick';
import TerminalManager from './TerminalManager';


export function activate(context: ExtensionContext) {
    let channel = window.createOutputChannel('CumulusCI');

    // Data Providers
    const orgDataProvider = new OrgDataProvider(channel);
    const flowDataProvider = new FlowDataProvider(channel);

    // Register Tree Views
    window.registerTreeDataProvider("cciOrgView", orgDataProvider);
    window.registerTreeDataProvider("cciFlowView", flowDataProvider);

    // Commands --> Command Palatte Additions
    commands.registerCommand('cci.version', () => {
        TerminalManager.runCommand('cci version');
    });
    commands.registerCommand('cci.project.init', () => {
        TerminalManager.runCommand('cci project init');
    });
    commands.registerCommand('cci.error.gist', () => {
        TerminalManager.runCommand('cci error gist');
    });
    commands.registerCommand('cci.org.connect', () => {
        window.showInformationMessage("Not implemented.");
    });
    commands.registerCommand('cci.service.connect', () => {
        window.showInformationMessage("Not implemented.");
    });
    commands.registerCommand('cci.refreshOrgs', () => {
        window.showInformationMessage('Refreshing Orgs...');
        orgDataProvider.refresh();
    });
    commands.registerCommand('cci.refreshFlows', () => flowDataProvider.getChildren(undefined));
    // Commands --> QuickPicks  
    commands.registerCommand('cci.orgOperations', (org: OrgNode) => {
        showOrgQuickPick(org, orgDataProvider);
    });
    commands.registerCommand('cci.runFlow', (flow: Flow) => {
        showFlowQuickPick(flow, orgDataProvider.orgs);
    });
    
    // Cleanup terminals we own if they get closed 
    window.onDidCloseTerminal(t => {
        if (t.name.startsWith('CumulusCI')) {
            channel.appendLine(`Removing terminal "${t.name}"`);
            TerminalManager.removeTerminal(t.name);
        }
    });
}

export function deactivate() {
    for (const terminal of window.terminals){
        if (terminal.name.startsWith('CumulusCI')) {
            console.log(`Disposing of terminal: ${terminal.name}`);
            terminal.dispose();
        }
    }
}
