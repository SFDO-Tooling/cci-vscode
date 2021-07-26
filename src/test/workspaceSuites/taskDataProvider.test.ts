/**
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as assert from "assert";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { FlowDataProvider } from "../../FlowDataProvider";
import * as ChildProcess from "child_process";
import { beforeEach, afterEach } from "mocha";
// import * as myExtension from '../extension';

const cciTaskListOutput = [
    {
        name: "deploy",
        description: "this is a description",
        group: "Salesforce MetaData",
    },
    {
        name: "deploy_pre",
        description: "this is a description",
        group: "Salesforce MetaData",
    },
    {
        name: "composite_request",
        description: "this is a description",
        group: "Data Operations",
    },
    {
        name: "load_dataset",
        description: "this is a description",
        group: "Data Operations",
    },
];

suite("Test TaskDataProvider w/ active workspace", () => {
    beforeEach(() => {
        const buff = Buffer.from(JSON.stringify(cciTaskListOutput));
        sinon.stub(ChildProcess, "execSync").returns(buff);
    });

    afterEach(() => {
        sinon.restore();
    });

    test("Extension activated", () => {
        const extension = vscode.extensions.getExtension("CumulusCI.cci");
        assert.strictEqual(extension?.isActive, true);
    });

    test("Returns expected tasks", async () => {
        const channel = vscode.window.createOutputChannel("test");
        const flowDataProvider = new FlowDataProvider(channel);
        // fetch the root node, which will return top level flow groups
        const flowGroups = await flowDataProvider.getChildren(undefined);
        assert.strictEqual(flowGroups?.length, 2);

        const taskNames = [
            "deploy",
            "deploy_pre",
            "composite_request",
            "load_dataset",
        ];
        for (let group of flowGroups) {
            let taskNodes = await flowDataProvider.getChildren(group);
            if (taskNodes) {
                for (let task of taskNodes) {
                    let taskName = task.label!.toString();
                    taskNames.includes(taskName);
                }
            }
        }
    });
});
