'use strict';
import * as vs from 'vscode';
import * as brackets from './brackets';

export function jumpLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document

    let bracketPos = brackets.bracketPosInDir(document, curPos, "left")
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
    }
}

export function jumpRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document    

    let bracketPos = brackets.bracketPosInDir(document, curPos, "right")
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
    }
}

export function selectLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let anchorPos = editor.selection.anchor
    let document = editor.document

    let bracketPos = brackets.bracketPosInDir(document, curPos, "left")
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
    }
}

export function selectRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let anchorPos = editor.selection.anchor
    let document = editor.document

    let bracketPos = brackets.bracketPosInDir(document, curPos, "right")
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
    }
}
