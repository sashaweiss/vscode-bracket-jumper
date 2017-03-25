'use strict';
import * as vs from 'vscode';

// NOTE: Using getWordRangeAtPosition would be dope, but it looks like it only examines single lines.
// let bracketRegex: RegExp = /{[\s\S]*}/
// let range: vscode.Range = document.getWordRangeAtPosition(cursorPosition, bracketRegex)

const LEFT_BRACKET = /[{\[\(]/
const RIGHT_BRACKET = /[}\]\)]/
type bracket = "{" | "}" | "[" | "]" | "(" | ")"

/**
 * Find the position of the nearest enclosing bracket to the right.
 * @param document a TextDocument
 * @param pos position to search from
 * @returns the bracket position
 */
export function bracketPosRightOfPos(document: vs.TextDocument, pos: vs.Position, bracketReg = RIGHT_BRACKET): vs.Position | null {
    let lineNum: number = pos.line
    
    let offset = pos.character + 1
    let line: string = document.lineAt(lineNum).text.substring(offset)
    
    let ind = indexOfRegex(line, bracketReg)
    let bracketInd: number | null = ind ? offset + ind : null 

    let max = document.lineCount - 1
    while (lineNum < max && !bracketInd) {
        line = document.lineAt(++lineNum).text
        bracketInd = indexOfRegex(line, bracketReg)
    }

    if (bracketInd) { return new vs.Position(lineNum, bracketInd) }
    return null
}

/**
 * Index of first regex match in string, or null
 * @param str string to search
 * @param reg regex to look for
 * @returns index of first match, or null
 */
function indexOfRegex(str: string, reg: RegExp): number | null {
    let match = str.match(reg)
    if (match) { return match.index + 1 }
    return null
}

/**
 * Find the position of the nearest enclosing bracket to the left.
 * @param document a TextDocument
 * @param pos position to search from
 * @param bracketReg regex to use for the bracket
 * @returns the bracket position
 */
export function bracketPosLeftOfPos(document: vs.TextDocument, pos: vs.Position, bracketReg = LEFT_BRACKET): vs.Position | null {
    let lineNum: number = pos.line
    let line: string = document.lineAt(lineNum).text.substring(0, pos.character)
    let bracketInd: number | null = lastIndexOfRegex(line, bracketReg)

    let min = 0
    while (lineNum > min && !bracketInd) {
        line = document.lineAt(--lineNum).text
        bracketInd = lastIndexOfRegex(line, bracketReg)
    }

    if (bracketInd) { return new vs.Position(lineNum, bracketInd) }
    return null
}

/**
 * Get the index of the last instance of a regex match in a string
 * @param str string to search
 * @param reg regex to look for
 * @returns index of match, or null if none
 */
function lastIndexOfRegex(str: string, reg: RegExp): number | null {
    let rev = str.split('').reverse().join('');
    let match = rev.match(reg)
    
    if (match) { return str.length - 1 - match.index }
    return null
}

function reverse(str): string {
    return str.split('').reverse().join('');
}

/**
 * Determine if current position has a bracket in the given direction, and returns it or null.
 * @param pos the position to check
 * @param dir the direction to check, either "left" or "right"
 * @returns the bracket, or null
 */
function bracketAtPos(document: vs.TextDocument, pos: vs.Position, dir: "left" | "right"): bracket | null {
    let line = document.lineAt(pos).text
    let ind = pos.character
    let char = dir == "right" ? line.substr(ind, 1) : line.substr(ind == 0 ? 0 : ind - 1, 1)

    return LEFT_BRACKET.test(char) || RIGHT_BRACKET.test(char) ? <bracket>char : null
}

/**
 * The position of the bracket matching the one at pos
 * @param document the active TextDocument
 * @param pos the position of the bracket to match
 * @param dir the direction to look for a match
 */
export function matchingBracketPosOfPos(document: vs.TextDocument, pos: vs.Position, dir: "left" | "right"): vs.Position | null {
    let bracket = bracketAtPos(document, pos, dir)
    if (!bracket) { return null }

    switch (bracket) {
        case "{":
            return bracketPosRightOfPos(document, pos, /}/)
        case "[":
            return bracketPosRightOfPos(document, pos, /]/)
        case "(":
            return bracketPosRightOfPos(document, pos, /)/)
        case "}":
            return bracketPosLeftOfPos(document, pos, /{/)
        case "]":
            return bracketPosLeftOfPos(document, pos, /\[/)
        case ")":
            return bracketPosLeftOfPos(document, pos, /\(/)
    }
}
