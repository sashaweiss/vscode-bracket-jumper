'use strict';
import * as vscode from 'vscode';
import * as brackets from './brackets';

export function activate(context: vscode.ExtensionContext) {

    console.log('bracket-jumper activating...registering commands...');

    let jumpLeft = vscode.commands.registerCommand('bracket-jumper.jumpLeft', () => {
        brackets.jumpLeft()
    });
    let jumpRight = vscode.commands.registerCommand('bracket-jumper.jumpRight', () => {
        brackets.jumpRight()
    })
    let selectLeft = vscode.commands.registerCommand('bracket-jumper.selectLeft', () => {
        brackets.selectLeft()
    })
    let selectRight = vscode.commands.registerCommand('bracket-jumper.selectRight', () => {
        brackets.selectRight()
    })

    console.log('Commands registered.')
    context.subscriptions.push(jumpLeft, jumpRight, selectLeft, selectRight);
}

export function deactivate() {
    // Currently do nothing...deregister commands?
}