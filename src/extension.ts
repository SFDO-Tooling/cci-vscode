import * as path from 'path';
import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

    let outputChannel = vscode.window.createOutputChannel('CumulusCI');
    outputChannel.show(); // make it visible to users
    outputChannel.appendLine('CumulusCI extension activated');

    vscode.window.registerTreeDataProvider("cciFlowsView", new FlowDataProvider());
    vscode.commands.registerCommand("cciFlowsView.selectNode", (item: vscode.TreeItem) => {
        outputChannel.appendLine(`Output: ${item.label}`);
    });



    let disposable = vscode.commands.registerCommand('cci.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from CumulusCI!');
    });

    context.subscriptions.push(disposable);
}

// called when the extension is deactivated
export function deactivate() {}


export class FlowDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    flows: Flow[];

    constructor() {
        this.flows = [];
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Flow[]> | Flow[] | null {

        // This should be changed to if (element === undefined)
        // but currently isn't working
        if (false) {
            exec('cci flow list --json', (error, stdout, stderr) => {
                let flowJson = JSON.parse(stdout);
                for (let i = 0; i < flowJson.length; ++i) {
                    let f = new Flow(flowJson[i]['name'], flowJson[i]['description'], vscode.TreeItemCollapsibleState.None);
                    // this command will run on click of the flow
                    f.command = {
                        command: "cciFlowsView.selectNode",
                        title: "Select Node",
                        arguments: [f]
                    };
                    this.flows.push(f);
                }
            });
            // Problem: we need to wait here for exec() to complete
            // I believe this involves returning a promise via a Thenable<T>A
            return new Promise<Flow[]>(resolve => resolve(this.flows));
        }
        return [
            new Flow('ci_beta','Continuous integration tests with Beta dependencies.', vscode.TreeItemCollapsibleState.None),
            new Flow('dev_org','Create an org for development purposes.', vscode.TreeItemCollapsibleState.None),
        ];
    }
}

export class Flow extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
    }
    
    // TODO: get MS coddicons working
    // https://github.com/microsoft/vscode-codicons
    iconPath = vscode.ThemeIcon.File;
}


