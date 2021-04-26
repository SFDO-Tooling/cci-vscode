
import { execSync } from 'child_process';
import * as vscode from 'vscode';


export class OrgDataProvider implements vscode.TreeDataProvider<OrgNode> {
    private orgs: OrgNode[];
    private output: vscode.OutputChannel;

    private _onDidChangeOrgDataEmitter: vscode.EventEmitter<OrgNode | undefined | void> = new vscode.EventEmitter<OrgNode | undefined | void>();
	readonly onDidChangeOrgData: vscode.Event<OrgNode | undefined | void> = this._onDidChangeOrgDataEmitter.event;

    constructor(output: vscode.OutputChannel) {
        this.orgs = [];
        this.output = output;
    }

    refresh(): void {
        console.log('refresh()');
        this._onDidChangeOrgDataEmitter.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        console.log(`getTreeitem(${element})`);
        return element;
    }

    getChildren(node?: vscode.TreeItem): Thenable<OrgNode[]> | OrgNode[] | null {
        console.log(`getChildren(${node})`);
        // no value for node means the extension is requesting the root node
        if (node === undefined) {
            // The first item in workspaceFolders corresponds to the rootPath
            // https://code.visualstudio.com/api/references/vscode-api#workspace
            const rootPath = vscode.workspace.workspaceFolders[0];
            if (rootPath === undefined) {
                return null;
            }
            this.orgs = [];
            this.output.appendLine('Fetching orgs from CumulusCI');
            let stdout = execSync('cci org list --json', {
                cwd: rootPath.uri.path
            });
            let orgJson = JSON.parse(stdout.toString());
            for (const key in orgJson) {
                let tooltip = '';
                let orgName = key;
                if (orgJson[key]["isDefault"]){
                    orgName += ' (Default)';
                    tooltip += 'is default: true';
                } else {
                    tooltip += 'is default: false';
                }

                let domain = 'n/a';
                let orgCreated = false;
                if (orgJson[key]["isScratch"]) {
                    let config = "config: orgs/" + orgJson[key]['config'] + ".json";
                    orgCreated = !orgJson[key]['expired'];
                    let days = 'n/a';
                    if (orgCreated) {
                        days = orgJson[key]['days'];
                        domain = orgJson[key]['domain'];
                    } 
                    tooltip += '\n' + config;
                    tooltip += `\nOrg Created: ${orgCreated}`;
                    tooltip += `\nDays: ${days}`;
                    tooltip += `\nDomain: ${domain}`;
                }
                else {
                    orgName += " (Persistent)";
                }

                let o = new OrgNode(
                    orgName,
                    key,
                    tooltip,
                    orgCreated,
                    vscode.TreeItemCollapsibleState.None
                );
                o.command = {
                    command: "cciOrgView.selectNode",
                    title: "Select Node",
                    arguments: [o]
                };
                this.orgs.push(o);
            }
            this.output.appendLine('Found ' + this.orgs.length + ' orgs');
        }
        return new Promise<OrgNode[]>(resolve => resolve(this.orgs));
    }
}



export class OrgNode extends vscode.TreeItem {
    public readonly contextValue = 'org';

    constructor(
        // The name displayed in the tree view
        public readonly name: string,
        // The name of the org (without anything extra added)
        public readonly devName: string,
        public readonly tooltip: string, 
        public readonly orgCreated: boolean,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(
            {
                label:name,
                highlights: orgCreated ? [[0,name.length]] : []
            },
            collapsibleState
        );
    }

    // TODO: get codicons working 
    // https://microsoft.github.io/vscode-codicons/dist/codicon.html
    iconPath = vscode.ThemeIcon.File;
}

