import { OutputChannel, ProgressLocation, Terminal, window, workspace } from "vscode";
import { exec, execSync } from 'child_process';
import { Flow } from './FlowDataProvider';
import { OrgNode } from "./OrgDataProvider";
import TerminalManager from "./TerminalManager";


export default async function showFlowQuickPick(flow: Flow, orgs: OrgNode[]) {
    let orgNames = orgs.map(org => org.devName);

    const chosenOrg = await window.showQuickPick(orgNames, {
        placeHolder: 'Choose an org to run the flow against...',
        onDidSelectItem: item => null 
    });

    if (chosenOrg){
        let cmd = `cci flow run ${flow.name} --org ${chosenOrg}`;
        TerminalManager.runCommand(cmd);
    }
    
}