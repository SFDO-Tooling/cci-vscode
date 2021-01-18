
import * as vscode from 'vscode';


export class OrgDataProvider implements vscode.TreeDataProvider<Org> {
    orgs: Org[];
    output: vscode.OutputChannel;

    constructor(output: vscode.OutputChannel) {
        this.orgs = [];
        this.output = output;
    }

    refresh(): void {
        this.output.appendLine('Refreshing orgs...');
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<Org[]> | Org[] | null {
        return [
            new Org('beta', 'orgs/beta.json', vscode.TreeItemCollapsibleState.None),
            new Org('dev', 'orgs/dev.json', vscode.TreeItemCollapsibleState.None),
            new Org('feature', 'orgs/feature.json', vscode.TreeItemCollapsibleState.None),
            new Org('qa', 'orgs/dev.json', vscode.TreeItemCollapsibleState.None),
            new Org('release', 'orgs/release.json', vscode.TreeItemCollapsibleState.None),
        ];
    }

}



export class Org extends vscode.TreeItem {
    public readonly contextValue = 'org';

    constructor(
        public readonly name: string,
        public readonly tooltip: string, // path/to/org.json
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
    }

    // TODO: get codicons working 
    // https://microsoft.github.io/vscode-codicons/dist/codicon.html
    iconPath = vscode.ThemeIcon.File;
}

