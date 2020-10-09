import * as vscode from 'vscode';


export class TaskDataProvider implements vscode.TreeDataProvider<Task> {
    flows: Task[];
    output: vscode.OutputChannel;

    constructor(output: vscode.OutputChannel) {
        this.flows = [];
        this.output = output;
    }

    refresh(): void {
        this.output.appendLine('Refreshing tasks...');
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Org[]> | Task[] | null {
        return [
            new Task('github_automerge_main', 'Merges commits to the main branch into feature branches.', vscode.TreeItemCollapsibleState.None),
            new Task('robot', 'Runs a Robot Framework test from a .robot file', vscode.TreeItemCollapsibleState.None),
            new Task('activate_flow', 'Activates Flows identified by a given list of Deceloper Names', vscode.TreeItemCollapsibleState.None),
            new Task('execute_anon', 'Execute anonymous apex via the tooling api.', vscode.TreeItemCollapsibleState.None),
        ];
    }

}



export class Task extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly tooltip: string, // path/to/org.json
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
    }

    // TODO: get codicons working (beaker looks neat)
    // https://microsoft.github.io/vscode-codicons/dist/codicon.html
    iconPath = vscode.ThemeIcon.File;
}

