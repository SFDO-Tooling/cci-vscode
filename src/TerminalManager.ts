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

    public runCommand(cmd: string) {
        this.terminal.show();
        this.terminal.sendText('clear');
        this.terminal.sendText(cmd);
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
    public static runCommand(cmd: string, terminalId: number | null = null): void {
        let terminal = undefined; 
        if (cmd.startsWith('cci flow run')) {
            terminal = TerminalManager.getNewTerminal();
        } else {
            terminal = TerminalManager.getMainTerminal();
        }
        terminal.runCommand(cmd);
    }

    /**
     * @param name The name of the CCITerminal instance to find.
     * @returns an instance of CCITerminal if one is found with the given
     * name, else undefined.
     */
    public static getMainTerminal(): CCITerminal | undefined {
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

