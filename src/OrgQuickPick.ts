import { OutputChannel, ProgressLocation, window, workspace } from "vscode";
import { exec, execSync } from 'child_process';
import { Org } from './OrgDataProvider';


export default async function showOrgQuickPick(org: Org, channel: OutputChannel) {
    let orgOperations = [
        'Open Org in Browser',
        'Set as Default Org',
        'Delete Org',
    ];

    const choice = await window.showQuickPick(orgOperations, {
        placeHolder: 'Choose an operation...',
        onDidSelectItem: item => null 
    });

    // Open Org in Browser
    if (choice === orgOperations[0]) {
        channel.appendLine(`Executing another option`);
        window.withProgress(
            {
                location: ProgressLocation.Notification,
                title: `Opening org ${org.devName} in browser` 
            },
            async (progress) => {
                progress.report({ increment: 0 });

                setTimeout(() => {
                    progress.report({ increment: 10, message: "Waking up CumulusCI" });
                }, 1000);

                setTimeout(() => {
                    progress.report({ increment: 30, message: "What browser are you using again?" });
                }, 3000);

                setTimeout(() => {
                    progress.report({ increment: 50, message: "Ah, got your browser." });
                }, 5000);

                setTimeout(() => {
                    progress.report({ increment: 75, message: "Grabbing another cup of coffee." });
                }, 7000);

                const p = new Promise<void>(resolve => {
                    exec(`cci org browser ${org.devName}`, {
                        // TODO: replace workspace.rootPath 
                        cwd: '/Users/brandon.parker/repos/cci2',
                        windowsHide: true,
                    }, (error, stdout, stderr) => {resolve();});
                });
                return p;
            }
        );
    } else if (choice === orgOperations[1]){

    } else if (choice === orgOperations[2]) {

    } else {
        console.log('We should not be here.');
    }



}
