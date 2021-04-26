import { OutputChannel, ProgressLocation, window, workspace, Terminal } from "vscode";
import { exec, execSync } from 'child_process';
import { OrgDataProvider, OrgNode } from './OrgDataProvider';
import { time } from "console";
import TerminalManager from "./TerminalManager";

export default async function showOrgQuickPick(org: OrgNode, orgDataProvider: OrgDataProvider) {
    
    // TODO: use enum for this
    let orgOperations = [
        'Get Org Info',
        'Open Org in Browser',
        'Set as Default Org',
        'Open an Org Shell',
        'Delete Org',
    ];

    const choice = await window.showQuickPick(orgOperations, {
        placeHolder: `Choose an operation for org ${org.devName}`,
        onDidSelectItem: item => null 
    });

    if (choice) {
        let cmd = '';
        if (choice === orgOperations[0]) {
            cmd = `cci org info ${org.devName}`;
        } else if (choice === orgOperations[1]){
            cmd = `cci org browser ${org.devName}`;
        } else if (choice === orgOperations[2]){
            cmd = `cci org default ${org.devName}`;
        } else if (choice === orgOperations[3]) {
            cmd = `cci org shell ${org.devName}`;
        } else if (choice === orgOperations[4]) {
            cmd = `cci org scratch_delete ${org.devName}`;
        }
        TerminalManager.runCommand(cmd);
    }
}
