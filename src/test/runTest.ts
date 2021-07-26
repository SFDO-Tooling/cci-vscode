/**
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as path from 'path';
import { runTests } from 'vscode-test';

async function main() {
        try {
                // The folder containing the Extension Manifest package.json
                // Passed to `--extensionDevelopmentPath`
                const extensionDevelopmentPath = path.resolve(__dirname, '../../');
                const withoutWorkspaceSuite = path.resolve(__dirname, './withoutWorkspaceSuites');
                // test without an active workspace
                await runTests({ 
                        extensionDevelopmentPath,
                        extensionTestsPath: withoutWorkspaceSuite,
                        // @ts-ignore
                        launchArgs: [undefined]
                });

                const withWorkspaceSuite = path.resolve(__dirname, './workspaceSuites');
                //test with an active workspace
                await runTests({ 
                        extensionDevelopmentPath,
                        extensionTestsPath: withWorkspaceSuite,
                        launchArgs: [withWorkspaceSuite] // set workspace to the suite directory
                });

        } catch (err) {
                console.error('Failed to run tests');
                process.exit(1);
        }
}

main();
