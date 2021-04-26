import { execSync } from 'child_process';
import * as vscode from 'vscode';


export class FlowDataProvider implements vscode.TreeDataProvider<Flow> {
    flowGroups: FlowGroup[];
    output: vscode.OutputChannel;
    flowsByGroup: Map<String, Flow[] | undefined>;

    constructor(output: vscode.OutputChannel) {
        this.flowGroups = [];
        this.output = output;
        this.flowsByGroup = new Map<String, Flow[]>();
    }

    refresh(): void {
        this.output.appendLine('Refreshing flows...');
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Flow[]> | Thenable<FlowGroup[]> | null{
        if (element){
            let flowsInGroup = this.flowsByGroup.get(element.label);
            if (flowsInGroup) {
                return new Promise<Flow[]>(resolve => resolve(flowsInGroup)); 
            } else {
                return null;
            }
        } else {
            const rootPath = vscode.workspace.workspaceFolders[0];
            if (rootPath === undefined) {
                return null;
            }
            this.output.appendLine('Fetching flows from CumulusCI');
            let stdout = execSync('cci flow list --json', {
                cwd: rootPath.uri.path
            });
            let flowJson = JSON.parse(stdout.toString());
            for (const flow of flowJson) {
                let f = new Flow(
                    flow['name'],
                    flow['description'],
                    vscode.TreeItemCollapsibleState.None
                );
                f.command = {
                    command: "cciFlowView.selectNode",
                    title: "Select Node",
                    arguments: [f]
                };
                let groupName = flow['group'] ? flow['group'] : 'Misc';
                let loadedFlows = this.flowsByGroup.get(groupName);
                if(loadedFlows) {
                    // pass by reference, so this sets the flows in the flowsByGroup map
                    loadedFlows.push(f);
                } else {
                    this.flowsByGroup.set(groupName, [f]);
                    this.flowGroups.push(new FlowGroup(groupName, vscode.TreeItemCollapsibleState.Collapsed));
                }
            }
            return new Promise<FlowGroup[]>(resolve => resolve(this.flowGroups));
        }
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

    // TODO: get codicons working (beaker looks neat)
    // https://microsoft.github.io/vscode-codicons/dist/codicon.html
    iconPath = vscode.ThemeIcon.File;
}

export class FlowGroup extends vscode.TreeItem {
    public readonly contextValue = 'flowGroup';

    constructor(
        public readonly name: string,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
    ) {
        super(name, collapsibleState);
    }

    iconPath = vscode.ThemeIcon.Folder;
}