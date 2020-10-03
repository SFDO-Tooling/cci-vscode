import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let outputChannel = vscode.window.createOutputChannel('CumulusCI');
    outputChannel.show(); // make it visible to users
    outputChannel.appendLine('CumulusCI extension activated');


    let disposable = vscode.commands.registerCommand('cci.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from CumulusCI!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
