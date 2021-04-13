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

    let cmd: string;

    if (choice === orgOperations[0]) {
        cmd = `cci org browser ${org.devName}`;
        channel.appendLine(`Executing: ${cmd}`);
        window.withProgress(
            {
                location: ProgressLocation.Notification,
                title: `Executing: ${cmd}` 
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
                    exec(cmd, {
                        // TODO: replace workspace.rootPath 
                        cwd: '/Users/brandon.parker/repos/cci2',
                        windowsHide: true,
                    }, (error, stdout, stderr) => {
                        // TODO: refresh the org view automatically
                        // to reflect up-to-date default org.
                        resolve();
                    });
                });
                return p;
            }
        );
    } else if (choice === orgOperations[1]){
        cmd = `cci org default ${org.devName}`;
        window.withProgress(
            {
                location: ProgressLocation.Notification,
                title: `Executing ${cmd}` 
            },
            async (progress) => {
                progress.report({ increment: 0 });

                setTimeout(() => {
                    progress.report({ increment: 40, message: "opening some files" });
                }, 1000);

                setTimeout(() => {
                    progress.report({ increment: 80, message: "rummaging around" });
                }, 3000);


                const p = new Promise<void>(resolve => {
                    exec(cmd, {
                        // TODO: replace workspace.rootPath 
                        cwd: '/Users/brandon.parker/repos/cci2',
                        windowsHide: true,
                    }, (error, stdout, stderr) => {resolve();});
                });
                return p;
            }
        );
    } else if (choice === orgOperations[2]) {
        cmd = `cci org scratch_delete ${org.devName}`;
        channel.appendLine(`Executing: ${cmd}`);
        window.withProgress(
            {
                location: ProgressLocation.Notification,
                title: `Executing ${cmd}` 
            },
            async (progress) => {
                progress.report({ increment: 0 });

                setTimeout(() => {
                    progress.report({ increment: 40, message: "digging org's grave" });
                }, 1000);

                setTimeout(() => {
                    progress.report({ increment: 80, message: "performing taps on the bugle" });
                }, 3000);


                const p = new Promise<void>(resolve => {
                    exec(cmd, {
                        // TODO: replace workspace.rootPath 
                        cwd: '/Users/brandon.parker/repos/cci2',
                        windowsHide: true,
                    }, (error, stdout, stderr) => {
                        // TODO: refresh org view 
                        resolve();});
                });
                return p;
            }
        );

    } else {
        console.log('We should not be here.');
    }



}
