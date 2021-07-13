/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { window, workspace, Terminal } from 'vscode';

/**
 * This class is a wrapper class for vscode's Terminal object.
 * https://code.visualstudio.com/api/references/vscode-api#Terminal
 * 
 * Responsible for interacting with window.createTerminal and the actual
 * Terminal instance itself. Also holds additional meta-info on the
 * terminal instance.
 */

class CCITerminal {
    public readonly name: string;
    public readonly id: number;
    public readonly createdAt: String;
    public readonly lastCommandRunAt: String | null;
    private readonly terminal: Terminal;
    constructor (
        name: string,
        id: number,
    ) {
        this.name = name;
        this.id = id;
        this.createdAt = Date();
        this.lastCommandRunAt = null;
        this.terminal = window.createTerminal(name);
    }

    public runCommand(cmd: string, newline: boolean = true) {
        this.terminal.show();
        this.terminal.sendText('clear');
        if (cmd.startsWith('cci task run')) {
            this.terminal.sendText("echo 'Provide any options for the task then press <ENTER>'");
            this.terminal.sendText(cmd + ' ', false);
        } else {
            this.terminal.sendText(cmd, newline);
        }
    }
}



/**
 * Manages terminals for the extension.
 * When part of the exension needs to
 * run a command through a terminal use:
 * TeminalManager.runCommand(terminalId);
 */
export default class TerminalManager {

    private static cciTerms: CCITerminal[] = [new CCITerminal('CumulusCI: Main', 1)];

    /**
     *  Executes a command in a CumulusCI terminal instance 
     * @param cmd - The command to execute in a terminal  
     * @param terminalId - Optional, the Id of the terminal to get.
     */
    public static runCommand(cmd: string, newline: boolean = true): void {
        let terminal : CCITerminal; 
        if (cmd.startsWith('cci flow run')) {
            terminal = TerminalManager.getNewTerminal();
        } else {
            terminal = TerminalManager.getMainTerminal();
        }
        terminal.runCommand(cmd, newline);
    }

    /**
     * @param name The name of the CCITerminal instance to find.
     * @returns The main instance of the CumulusCI terminal.
     * If not found, one is created.
     */
    public static getMainTerminal(): CCITerminal {
        for (const terminal of TerminalManager.cciTerms) {
            if (terminal.name === "CumulusCI: Main") {
                return terminal;
            }
        }
        const terminal = new CCITerminal('CumulusCI: Main', 0);
        TerminalManager.cciTerms.push(terminal);
        return terminal;
    }

    private static getNewTerminal(): CCITerminal {
        // @@@ We can add logic here to check for old terminals
        // and dispose of them, or if we can identify one that
        // isn't running a task/flow we can return an existing one
        // instead of always creating a new one.
        const num = TerminalManager.cciTerms.length + 1;
        const name = `CumulusCI: ${num}`;
        const terminal = new CCITerminal(name, num);
        TerminalManager.cciTerms.push(terminal);
        return terminal;
    }

    public static removeTerminal(name: string): void {
        for (const t of TerminalManager.cciTerms) {
            if (t.name === name) {
                const index = TerminalManager.cciTerms.indexOf(t);
                if (index > -1) {
                    TerminalManager.cciTerms.splice(index, 1);
                }
            }
        }
    }
}

