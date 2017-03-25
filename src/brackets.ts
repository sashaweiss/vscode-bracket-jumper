'use strict';
import * as vs from 'vscode';

const LEFT_BRACKET = /[{\[\(]/
const RIGHT_BRACKET = /[}\]\)]/

function bracketPosRightOfPos(document: vs.TextDocument, pos: vs.Position): vs.Position | null {
    let lineNum: number = pos.line
    
    let offset = pos.character + 1
    let line: string = document.lineAt(lineNum).text.substring(offset)
    
    let ind = indexOfRegex(line, RIGHT_BRACKET)
    let bracketInd: number | null = ind ? offset + ind : null 

    let max = document.lineCount - 1
    while (lineNum < max && !bracketInd) {
        line = document.lineAt(++lineNum).text
        bracketInd = indexOfRegex(line, RIGHT_BRACKET)
    }

    if (bracketInd) { return new vs.Position(lineNum, bracketInd) }
    return null
}

function indexOfRegex(str: string, reg: RegExp): number | null {
    let match = str.match(reg)
    if (match) { return match.index + 1 }
    return null
}

function bracketPosLeftOfPos(document: vs.TextDocument, pos: vs.Position): vs.Position | null {
    let lineNum: number = pos.line
    let line: string = document.lineAt(lineNum).text.substring(0, pos.character)
    let bracketInd: number | null = lastIndexOfRegex(line, LEFT_BRACKET)

    let min = 0
    while (lineNum > min && !bracketInd) {
        line = document.lineAt(--lineNum).text
        bracketInd = lastIndexOfRegex(line, LEFT_BRACKET)
    }

    if (bracketInd) { return new vs.Position(lineNum, bracketInd) }
    return null
}

function lastIndexOfRegex(str: string, reg: RegExp): number | null {
    let rev = str.split('').reverse().join('');
    let match = rev.match(reg)
    
    if (match) { return str.length - 1 - match.index }
    return null
}

function reverse(str): string {
    return str.split('').reverse().join('');
}

// Using getWordRangeAtPosition would be dope, but it looks like it only
// examines single lines.
// How cool would it be to extend the functionality? Maybe future project.
// let bracketRegex: RegExp = /{[\s\S]*}/
// let range: vscode.Range = document.getWordRangeAtPosition(cursorPosition, bracketRegex)

export function jumpLeft() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document

    let bracketPos = bracketPosLeftOfPos(document, curPos)
    if (bracketPos) {
        let newSelection = new vs.Selection(bracketPos, bracketPos)
        editor.selection = newSelection
    }
}

export function jumpRight() {
    let editor = vs.window.activeTextEditor;
    let curPos = editor.selection.active
    let document = editor.document    

    let bracketPos = bracketPosRightOfPos(document, curPos)
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

    let bracketPos = bracketPosLeftOfPos(document, curPos)
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

    let bracketPos = bracketPosRightOfPos(document, curPos)
    if (bracketPos) {
        let newSelection = new vs.Selection(anchorPos, bracketPos)
        editor.selection = newSelection
    }
}
