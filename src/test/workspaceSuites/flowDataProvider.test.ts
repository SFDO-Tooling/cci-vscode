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

const cciFlowListOutput = [
    {
        name: "ci_beta",
        description: "this is a description",
        group: "Continuous Integration",
    },
    {
        name: "ci_dev",
        description: "this is a description",
        group: "Continuous Integration",
    },
    {
        name: "dev_org",
        description: "this is a description",
        group: "Org Setup",
    },
    {
        name: "qa_org",
        description: "this is a description",
        group: "Org Setup",
    },
];

suite("Test FlowDataProvider w/ active workspace", () => {
    beforeEach(() => {
        const buff = Buffer.from(JSON.stringify(cciFlowListOutput));
        sinon.stub(ChildProcess, "execSync").returns(buff);
    });

    afterEach(() => {
        sinon.restore();
    });

    test("Extension activated", () => {
        const extension = vscode.extensions.getExtension("CumulusCI.cci");
        assert.strictEqual(extension?.isActive, true);
    });

    test("Returns expected flows", async () => {
        const channel = vscode.window.createOutputChannel("test");
        const flowDataProvider = new FlowDataProvider(channel);
        // fetch the root node, which will return top level flow groups
        const flowGroups = await flowDataProvider.getChildren(undefined);
        assert.strictEqual(flowGroups?.length, 2);

        const flowNames = ["ci_beta", "ci_dev", "dev_org", "qa_org"];
        for (let group of flowGroups) {
            let flowNodes = await flowDataProvider.getChildren(group);
            if (flowNodes) {
                for (let flow of flowNodes) {
                    let flowName = flow.label!.toString();
                    assert(flowNames.includes(flowName));
                }
            }
        }
    });
});
