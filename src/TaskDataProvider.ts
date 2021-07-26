/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { OutputChannel, ThemeIcon, TreeItem, TreeItemCollapsibleState, TreeDataProvider, workspace }from 'vscode';
import { execSync } from 'child_process';


export class TaskDataProvider implements TreeDataProvider<Task | TaskGroup> {
    private taskGroups: TaskGroup[];
    private output: OutputChannel;
    private tasksByGroup: Map<String, Task[] | undefined>;

    constructor(output: OutputChannel) {
        this.taskGroups = [];
        this.output = output;
        this.tasksByGroup = new Map<String, Task[]>();
    }

    refresh(): void {
        this.output.appendLine('Refreshing flows...');
    }

    getTreeItem(element: TreeItem): TreeItem {
        return element;
    }

    getChildren(node?: TreeItem): Thenable<Task[]> | Thenable<TaskGroup[]> | null{
        // If the workspace isn't open to a specific directory then
        // we don't know where to run `cci task list --json` from.
        if (workspace.workspaceFolders === undefined) {
            return null;
        }
        if (node){
            let tasksInGroup = this.tasksByGroup.get(node.label!);
            if (tasksInGroup) {
                return new Promise<Task[]>(resolve => resolve(tasksInGroup!)); 
            } else {
                return null;
            }
        } else {
            const rootPath = workspace.workspaceFolders![0];
            this.output.appendLine('Fetching flows from CumulusCI');
            let stdout = execSync('cci task list --json', {
                cwd: rootPath.uri.path
            });
            let flowJson = JSON.parse(stdout.toString());
            for (const task of flowJson) {
                let f = new Task(
                    task['name'],
                    task['description'],
                    TreeItemCollapsibleState.None
                );
                f.command = {
                    command: "cciFlowView.selectNode",
                    title: "Select Node",
                    arguments: [f]
                };
                let groupName = task['group'] ? task['group'] : 'Misc';
                let loadedTasks = this.tasksByGroup.get(groupName);
                if(loadedTasks) {
                    // pass by reference, so this sets the flows in the flowsByGroup map
                    loadedTasks.push(f);
                } else {
                    this.tasksByGroup.set(groupName, [f]);
                    this.taskGroups.push(new TaskGroup(groupName, TreeItemCollapsibleState.Collapsed));
                }
            }
            return new Promise<TaskGroup[]>(resolve => resolve(this.taskGroups));
        }
    }
}


export class Task extends TreeItem {
    iconPath = ThemeIcon.File;
    public readonly contextValue = 'task';

    constructor(
        public readonly name: string,
        public readonly tooltip: string, // The on-hover tooltip
        collapsibleState: TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
    }

}

export class TaskGroup extends TreeItem {
    iconPath = ThemeIcon.Folder;
    public readonly contextValue = 'taskGroup';

    constructor(
        public readonly name: string,
        collapsibleState: TreeItemCollapsibleState.Collapsed
    ) {
        super(name, collapsibleState);
    }

}