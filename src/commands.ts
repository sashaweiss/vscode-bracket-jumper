'use strict';
import * as vs from 'vscode';
import * as brackets from './brackets';

export function jumpLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document

    let bracketPos = brackets.bracketInDir(document, curPos, "left")
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function jumpRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document

    let bracketPos = brackets.bracketInDir(document, curPos, "right")
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function selectLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active  
    let anchorPos = editor.selection.anchor
    let document = editor.document

    let bracketPos = brackets.bracketInDir(document, curPos, "left")
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function selectRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let anchorPos = editor.selection.anchor
    let document = editor.document

    let bracketPos = brackets.bracketInDir(document, curPos, "right")
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function ascendLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document

    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "left")
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function ascendRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document

    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "right")
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function ascendSelectLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active  
    let anchorPos = editor.selection.anchor
    let document = editor.document

    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "left")
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}

export function ascendSelectRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active  
    let anchorPos = editor.selection.anchor
    let document = editor.document

    let bracketPos = brackets.unmatchedBracketInDir(document, curPos, "right")
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
        editor.revealRange(new vs.Range(bracketPos, bracketPos))
    }
}