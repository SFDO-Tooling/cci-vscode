import { OutputChannel, ProgressLocation, window, workspace } from "vscode";
import { exec, execSync } from 'child_process';
import { Flow } from './FlowDataProvider';
import { Org } from "./OrgDataProvider";


export default async function showFlowQuickPick(flow: Flow, orgs: Org[], channel: OutputChannel) {
    let orgNames = orgs.map(org => org.devName);

    channel.appendLine(`${console.dir(orgNames)}`);
    const chosenOrg = await window.showQuickPick(orgNames, {
        placeHolder: 'Choose an org to run the flow against...',
        onDidSelectItem: item => null 
    });

    let cmd = `cci flow run ${flow.name} --org ${chosenOrg}`;
    channel.appendLine(`Executing: ${cmd}`);
    window.withProgress(
        {
            location: ProgressLocation.Notification,
            title: `Executing: ${cmd}` 
        },
        async (progress) => {
            progress.report({ increment: 0 });

            setTimeout(() => {
                progress.report({ increment: 10, message: "Talking to CumulusCI" });
            }, 1000);

            setTimeout(() => {
                progress.report({ increment: 50, message: "Wading through Salesforce APIs" });
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
}