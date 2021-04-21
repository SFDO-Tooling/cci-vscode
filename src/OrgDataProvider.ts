
import { execSync } from 'child_process';
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
        if (element === undefined) {
            this.output.appendLine('Fetching orgs from CumulusCI');
            let stdout = execSync('cci org list --json', {
                    cwd: "/Users/brandon.parker/repos/cci2"
                }
            );
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

                let o = new Org(
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
        return new Promise<Org[]>(resolve => resolve(this.orgs));
    }
}



export class Org extends vscode.TreeItem {
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

