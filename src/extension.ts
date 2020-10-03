import { exec } from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let outputChannel = vscode.window.createOutputChannel('CumulusCI');
    outputChannel.show(); // make it visible to users
    outputChannel.appendLine('CumulusCI extension activated');

    vscode.window.registerTreeDataProvider("cciFlowsview", new FlowDataProvider());
    vscode.commands.registerCommand("cciFlowsView.selectNode", (item: vscode.TreeItem) => {
        outputChannel.appendLine(`Output: ${item.label}`)
    });



    let disposable = vscode.commands.registerCommand('cci.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from CumulusCI!');
    });

    context.subscriptions.push(disposable);
}

// called when the extension is deactivated
export function deactivate() { }


export class FlowDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    cmd_output: string | undefined;
    flows: Flow[];

    constructor() {
        this.flows = [];
        this.cmd_output = undefined;
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Flow[]> {
        if (element === undefined) {
            exec('cci flow list --json', (error: string, stdout: string, stderr: string) => {
                let flowJson = JSON.parse(stdout);
                for (let i = 0; i < flowJson.length; ++i) {
                    let f = new Flow(flowJson[i]['name'], flowJson[i]['description'], vscode.TreeItemCollapsibleState.None);
                    // this command will run on click of the flow
                    f.command = {
                        command: "cciFlowsView.selectNode",
                        title: "Select Node",
                        arguments: [f]
                    }
                    this.flows.push(f);
                }
            });
            // Problem is that we need to wait here for exec() to complete
            // I believe this involves returning a promise via a Thenable<T>A
            return new Promise<Flow[]>(resolve => resolve(this.flows));
        }
    }
}

export class Flow extends vscode.TreeItem {

    constructor(
        // label == name of flow
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}


