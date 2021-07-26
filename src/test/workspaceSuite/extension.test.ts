/**
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { OrgDataProvider } from '../../OrgDataProvider';
import * as ChildProcess from 'child_process';
import { beforeEach, afterEach } from 'mocha';
// import * as myExtension from '../extension';

const cciOrgListOutput = {
        "beta": {
                "is_default": false,
                "days": "1",
                "expired": true,
                "config": "beta",
                "domain": "",
                "is_scratch": true,
        },
        "dev": {
                "is_default": true,
                "days": "1",
                "expired": true,
                "config": "beta",
                "domain": "",
                "is_scratch": true,
        }
};

suite('Test OrgDataProvider w/ active workspace', () => {

        beforeEach(() => {
                const cciOrgListBuff = Buffer.from(JSON.stringify(cciOrgListOutput));
                sinon.stub(ChildProcess, 'execSync').returns(cciOrgListBuff);
        });

        afterEach(() => {
                sinon.restore();
        });

        test('Extension is activated', () => {
                const extension = vscode.extensions.getExtension('CumulusCI.cci');
                assert.strictEqual(extension?.isActive, true);
        });


        test('Returns expected orgs', async () => {
                const channel = vscode.window.createOutputChannel('test');
                const orgDataProvider = new OrgDataProvider(channel);
                // fetch the root node, which will return all orgs
                const orgNodes = await orgDataProvider.getChildren(undefined);
                assert.strictEqual(orgNodes?.length, 2);
        });
});
