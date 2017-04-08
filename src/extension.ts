'use strict';
import * as vscode from 'vscode';
import * as commands from './commands';
import { updateLeftRight } from './brackets'

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
    let ascendLeft = vscode.commands.registerCommand('bracket-jumper.ascendLeft', () => {
        commands.ascendLeft()
    })
    let ascendRight = vscode.commands.registerCommand('bracket-jumper.ascendRight', () => {
        commands.ascendRight()
    })
    let ascendSelectLeft = vscode.commands.registerCommand('bracket-jumper.selectAscendLeft', () => {
        commands.ascendSelectLeft()
    })
    let ascendSelectRight = vscode.commands.registerCommand('bracket-jumper.selectAscendRight', () => {
        commands.ascendSelectRight()
    })
    let configListener = vscode.workspace.onDidChangeConfiguration(() => {
        updateLeftRight()
    })

    console.log('Commands registered.')
    context.subscriptions.push(jumpLeft, jumpRight, selectLeft, selectRight, ascendLeft, ascendRight, ascendSelectLeft, ascendSelectRight, configListener);
}

export function deactivate() {
    // Currently do nothing...deregister commands?
}