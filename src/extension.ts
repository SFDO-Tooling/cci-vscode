/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {commands, window, ExtensionContext, OutputChannel, workspace } from 'vscode';
import { Flow, FlowDataProvider } from './FlowDataProvider';
import { Task, TaskDataProvider } from './TaskDataProvider';
import { OrgNode, OrgDataProvider } from './OrgDataProvider';
import showOrgQuickPick from './OrgQuickPick';
import showFlowQuickPick from './FlowQuickPick';
import TerminalManager from './TerminalManager';


export function activate(context: ExtensionContext) {
    let channel = window.createOutputChannel('CumulusCI');

    // Data Providers
    const orgDataProvider = new OrgDataProvider(channel);
    const taskDataProvider = new TaskDataProvider(channel);
    const flowDataProvider = new FlowDataProvider(channel);

    // Register Tree Views
    window.registerTreeDataProvider("cciOrgView", orgDataProvider);
    window.registerTreeDataProvider("cciFlowView", flowDataProvider);
    window.registerTreeDataProvider("cciTaskView", taskDataProvider);


    // Command Palatte Additions
    /*********************************************/
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


    // Org view commands 
    /*********************************************/
    commands.registerCommand('cci.refreshOrgs', () => {
        window.showInformationMessage('Refreshing Orgs...');
        orgDataProvider.refresh();
    });
    commands.registerCommand('cci.orgOperations', (org: OrgNode) => {
        showOrgQuickPick(org, orgDataProvider);
    });


    // Task view commands 
    /*********************************************/
    commands.registerCommand('cci.refreshTasks', () => {
        window.showInformationMessage('Refreshing Tasks...');
        taskDataProvider.refresh();
    });
    commands.registerCommand('cci.runTask', (task: Task) => {
        TerminalManager.runCommand(`cci task run ${task.name}`, false);
    });


    // Flow view commands 
    /*********************************************/
    commands.registerCommand('cci.refreshFlows', () => {
        window.showInformationMessage('Refreshing Flows...');
        flowDataProvider.refresh();
    });
    commands.registerCommand('cci.runFlow', (flow: Flow) => {
        showFlowQuickPick(flow, orgDataProvider.orgs);
    });
   
    // async tasks
    /*********************************************/
    window.onDidCloseTerminal(t => {
        if (t.name.startsWith('CumulusCI')) {
            channel.appendLine(`Removing terminal "${t.name}"`);
            TerminalManager.removeTerminal(t.name);
        }
    });
}

// Cleanup terminals when extension is exited
export function deactivate() {
    for (const terminal of window.terminals){
        if (terminal.name.startsWith('CumulusCI')) {
            terminal.dispose();
        }
    }
}
