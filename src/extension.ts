'use strict';
import * as vscode from 'vscode';
import * as commands from './commands_tokens';

export function activate(context: vscode.ExtensionContext) {

    console.log('bracket-jumper activating...registering commands...');

    let jumpLeft = vscode.commands.registerCommand('bracket-jumper.jumpLeft', () => {
        commands.jumpLeft()
    });
    let jumpRight = vscode.commands.registerCommand('bracket-jumper.jumpRight', () => {
        commands.jumpRight()
    })
    let selectLeft = vscode.commands.registerCommand('bracket-jumper.selectLeft', () => {
        commands.selectLeft()
    })
    let selectRight = vscode.commands.registerCommand('bracket-jumper.selectRight', () => {
        commands.selectRight()
    })

    console.log('Commands registered.')
    context.subscriptions.push(jumpLeft, jumpRight, selectLeft, selectRight);
}

export function deactivate() {
    // Currently do nothing...deregister commands?
}