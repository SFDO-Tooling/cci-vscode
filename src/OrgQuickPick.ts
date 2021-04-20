import { OutputChannel, ProgressLocation, window, workspace, Terminal } from "vscode";
import { exec, execSync } from 'child_process';
import { Org } from './OrgDataProvider';

export default async function showOrgQuickPick(org: Org, terminal: Terminal) {
    // TODO: use enum for this
    let orgOperations = [
        'Open Org in Browser',
        'Set as Default Org',
        'Delete Org',
    ];

    const choice = await window.showQuickPick(orgOperations, {
        placeHolder: 'Choose an operation...',
        onDidSelectItem: item => null 
    });

    if (choice) {
        let cmd = '';
        if (choice === orgOperations[0]) {
            cmd = `cci org browser ${org.devName}`;
        } else if (choice === orgOperations[1]){
            cmd = `cci org default ${org.devName}`;
        } else if (choice === orgOperations[2]) {
            cmd = `cci org scratch_delete ${org.devName}`;
        }
        terminal.show();
        terminal.sendText(cmd);
    }
}
