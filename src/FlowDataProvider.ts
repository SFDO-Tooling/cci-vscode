import { execSync } from 'child_process';
import * as vscode from 'vscode';


export class FlowDataProvider implements vscode.TreeDataProvider<Flow> {
    flows: Flow[];
    output: vscode.OutputChannel;

    constructor(output: vscode.OutputChannel) {
        this.flows = [];
        this.output = output;
    }

    refresh(): void {
        this.output.appendLine('Refreshing flows...');
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Flow[]> | Flow[] | null {
        if (element === undefined) {
            this.output.appendLine('> Fetching flows from CumulusCI');
            let stdout = execSync('cci flow list --json');
            let flowJson = JSON.parse(stdout.toString());
            for (let i = 0; i < flowJson.length; ++i) {
                let f = new Flow(
                    flowJson[i]['name'],
                    flowJson[i]['description'],
                    vscode.TreeItemCollapsibleState.None
                );
                f.command = {
                    command: "cciFlowView.selectNode",
                    title: "Select Node",
                    arguments: [f]
                };
                this.flows.push(f);
            }
            this.output.appendLine('> Found ' + this.flows.length + ' flows');
        }
        return new Promise<Flow[]>(resolve => resolve(this.flows));
    }

}


export class Flow extends vscode.TreeItem {
    public readonly contextValue = 'flow';

    constructor(
        public readonly name: string,
        public readonly tooltip: string, // Flow Description
        collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
    }

    run(output: vscode.OutputChannel): void {
        output.appendLine(`Running: cci flow run ${this.name}`);
    }
    // TODO: get codicons working (beaker looks neat)
    // https://microsoft.github.io/vscode-codicons/dist/codicon.html
    iconPath = vscode.ThemeIcon.File;
}
