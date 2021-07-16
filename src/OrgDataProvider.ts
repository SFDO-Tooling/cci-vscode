import * as path from 'path';
import { execSync } from 'child_process';
import { Event, EventEmitter, OutputChannel, TreeItem, TreeItemCollapsibleState, TreeDataProvider, workspace } from 'vscode';


export class OrgDataProvider implements TreeDataProvider<OrgNode> {
    public orgs: OrgNode[] = []; 
    private output: OutputChannel;
    private _onDidChangeTreeData: EventEmitter<OrgNode | undefined | null | void> = new EventEmitter<OrgNode | undefined | null | void>();
    readonly onDidChangeTreeData: Event<OrgNode | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(output: OutputChannel) {
        this.output = output;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): TreeItem {
        return element;
    }

    getChildren(node?: TreeItem): Thenable<OrgNode[]> | OrgNode[] | null {
        // no value for node means the extension is requesting the root node
        if (node === undefined) {
            // The first item in workspaceFolders corresponds to the rootPath
            // https://code.visualstudio.com/api/references/vscode-api#workspace
            const rootPath = workspace.workspaceFolders![0];
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
                    tooltip += "\nThis is a scratch org.";
                }
                else {
                    tooltip += "\nThis is a connected org.";
                }

                let o = new OrgNode(
                    orgName,
                    key,
                    tooltip,
                    orgCreated,
                    orgJson[key]['isScratch'],
                    TreeItemCollapsibleState.None
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


export class OrgNode extends TreeItem {
        // This is references in package.json to determine
        // on what nodes to display a specific icon
        public readonly contextValue = 'org';

    constructor(
        // The name displayed in the tree view
        public readonly name: string,
        // The name of the org (without anything extra added)
        public readonly devName: string,
        // The on-hover tooltip text
        public readonly tooltip: string, 
        public readonly orgCreated: boolean,
        public readonly isScratch: boolean,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
        let iconPath = '';
        if (isScratch && orgCreated){
            iconPath = path.join(__filename, '..', '..', 'media', 'images', 'green-circle.svg');
        } else if (isScratch) {
            iconPath = path.join(__filename, '..', '..', 'media', 'images', 'green-circle-dashed.svg');
        } else {
            iconPath = path.join(__filename, '..', '..', 'media', 'images', 'connected-blue.svg');
        }
        this.iconPath = iconPath;
    }
}

