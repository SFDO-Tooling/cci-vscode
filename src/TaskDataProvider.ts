import * as vscode from 'vscode';
import { execSync } from 'child_process';


export class TaskDataProvider implements vscode.TreeDataProvider<Task> {
    tasks: Task[];
    output: vscode.OutputChannel;

    constructor(output: vscode.OutputChannel) {
        this.tasks = [];
        this.output = output;
    }

    refresh(): void {
        vscode.window.showInformationMessage('Refreshing Tasks');
        this.tasks = [];
        this.getChildren(undefined);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Task[]> | Task[] | null {
        if (element === undefined) {
            this.output.appendLine('> Fetching tasks');
            const stdout = execSync('cci task list --json');
            const taskJson = JSON.parse(stdout.toString());
            for (let i = 0; i < taskJson.length; ++i) {
                let t = new Task(
                    taskJson[i]['name'], 
                    taskJson[i]['description'],
                    vscode.TreeItemCollapsibleState.None
                );
                t.command = {
                    command: "cciFlowView.selectNode",
                    title: "Select Node",
                    arguments: [t]
                };
                this.tasks.push(t);
            }
            this.output.appendLine('> Found ' + this.tasks.length + ' tasks');
        }
        return new Promise<Task[]>(resolve => resolve(this.tasks));
    }

}


export class Task extends vscode.TreeItem {
    public readonly contextValue = 'task';

    constructor(
        public readonly name: string,
        public readonly tooltip: string, 
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
    }

    // TODO: get codicons working
    // https://microsoft.github.io/vscode-codicons/dist/codicon.html
    iconPath = vscode.ThemeIcon.File;
}

