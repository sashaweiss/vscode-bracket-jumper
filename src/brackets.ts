'use strict';
import * as vs from 'vscode'

let LEFT = vs.workspace.getConfiguration('bracket-jumper').get<string[]>('openingBrackets')
let RIGHT = vs.workspace.getConfiguration('bracket-jumper').get<string[]>('closingBrackets')
let LAND_INSIDE = vs.workspace.getConfiguration('bracket-jumper').get<boolean>('landInside')

/**
 * Get the character left or right of the given position
 * @param document the document to get from
 * @param pos the position to get at
 * @param dir the direction to get in
 */
function charAtPos(document: vs.TextDocument, pos: vs.Position): string {
    let line = document.lineAt(pos).text
    let ind = pos.character
    return line.charAt(ind)
}

/**
 * The position one step left in the document
 * @param document the document to move in
 * @param pos the position to move from
 * @returns the position one step left, or null if last
 */
function posLeft(document: vs.TextDocument, pos: vs.Position): vs.Position | null {
    let offset = document.offsetAt(pos)
    return offset > 0 ? document.positionAt(offset - 1) : null
}

/**
 * The position one step right in the document
 * @param document the document to move in
 * @param pos the position to move from
 * @returns the position one step right, or null if first
 */
function posRight(document: vs.TextDocument, pos: vs.Position): vs.Position | null {
    let offset = document.offsetAt(pos)
    let next = offset < document.getText().length ? document.positionAt(offset + 1) : null

    // If next same as pos, shift by two. See: https://github.com/Microsoft/vscode/issues/23247
    return next && pos.isEqual(next) ? document.positionAt(offset + 2) : next
}

/**
 * The position of the nearest enclosing unmatched bracket, in the given direction.
 * @param document the document to search
 * @param pos the position to search from
 * @param dir the direction to search
 * @returns the bracket position, or null if not found
 */
export function unmatchedBracketInDir(doc: vs.TextDocument, pos: vs.Position, dir: "left" | "right"): vs.Position | null {
    let [des, pair] = dir == "left" ? [LEFT, RIGHT] : [RIGHT, LEFT]
    let posFun = dir == "left" ? posLeft : posRight
    
    // Pesky edge case jumping right
    // when current char is a right bracket while landing outside
    // when current char is a left bracket while landing inside
    // skips it otherwise (if there are more brackets, if not it won't move)
    if (dir == "right") {
        const currChar = charAtPos(doc, pos);
        if ((RIGHT.includes(currChar) && !LAND_INSIDE) || (LEFT.includes(currChar) && LAND_INSIDE)) {
            return new vs.Position(pos.line, pos.character + 1)
        }
    }

    // Pesky edge case jumping left
    // when prev char is a left bracket while landing outside
    // when prev char is a right bracket while landing inside
    // skips it otherwise (if there are more brackets, if not it won't move)
    if (dir == "left") {
        // Hotfix for https://github.com/sashaweiss/vscode-bracket-jumper/issues/1
        if (posLeft(doc, pos) == null) { return null; }   
        
        const prev = posLeft(doc, pos)
        const prevChar = charAtPos(doc, prev)
        if ((LEFT.includes(prevChar) && !LAND_INSIDE) || (RIGHT.includes(prevChar) && LAND_INSIDE)) {
            return prev
        }
    }

    // Skip examining current char if going left, otherwise gets stuck (at right bracket if landing outside and at left bracket if landing inside)
    let pAdj = dir == "left" ? posLeft(doc, pos) : pos

    let paired = Array<number>(LEFT.length).fill(0)

    while ((pAdj = posFun(doc, pAdj))) {
        let char = charAtPos(doc, pAdj)
        
        // Avoid jumping to internally paired bracket sets
        let pairInd = pair.indexOf(char)
        if (pairInd != -1) { 
            paired[pairInd]++
            continue
        }
        
        let desInd = des.indexOf(char)
        if (desInd != -1) {
            if (paired[desInd] > 0) {
                paired[desInd]--
            }
            else {
                if (dir == "left") {
                    return LAND_INSIDE ? new vs.Position(pAdj.line, pAdj.character + 1) : pAdj
                }
                else {
                    return LAND_INSIDE ? pAdj : new vs.Position(pAdj.line, pAdj.character + 1)
                }
            }
        }
    }
    return null
}

/**
 * The position of the nearest bracket in the given direction.
 * @param document the document to search
 * @param pos the position to search from
 * @param dir the direction to search
 * @returns the bracket position, or null if not found
 */
export function bracketInDir(doc: vs.TextDocument, pos: vs.Position, dir: "left" | "right"): vs.Position | null {
    let posFun = dir == "left" ? posLeft : posRight

    // Pesky edge case jumping right
    // when current char is a right bracket while landing outside
    // when current char is a left bracket while landing inside
    // skips it otherwise (if there are more brackets, if not it won't move)

    if (dir == "right") {
        const currChar = charAtPos(doc, pos);
        if ((RIGHT.includes(currChar) && !LAND_INSIDE) || (LEFT.includes(currChar) && LAND_INSIDE)) {
            return new vs.Position(pos.line, pos.character + 1)
        }
    }

    // Pesky edge case jumping left
    // when prev char is a left bracket while landing outside
    // when prev char is a right bracket while landing inside
    // skips it otherwise (if there are more brackets, if not it won't move)
    if (dir == "left") {
        // Hotfix for https://github.com/sashaweiss/vscode-bracket-jumper/issues/1
        if (posLeft(doc, pos) == null) { return null; }
        
        const prev = posLeft(doc, pos)
        const prevChar = charAtPos(doc, prev)
        if ((LEFT.includes(prevChar) && !LAND_INSIDE) || (RIGHT.includes(prevChar) && LAND_INSIDE)) {
            return prev
        }
    }

    // Skip examining current char if going left, otherwise gets stuck (at right bracket if landing outside and at left bracket if landing inside)
    let pAdj = dir == "left" ? posLeft(doc, pos) : pos

    while ((pAdj = posFun(doc, pAdj))) {
        let char = charAtPos(doc, pAdj)

        if (LEFT.includes(char)) {
             return LAND_INSIDE ? new vs.Position(pAdj.line, pAdj.character + 1) : pAdj
        }
        else if (RIGHT.includes(char)) {
            return LAND_INSIDE ? pAdj : new vs.Position(pAdj.line, pAdj.character + 1)
        }
    }
    return null
}

/**
 * Update the LEFT and RIGHT arrays.
 */
export function updateLeftRight() {
    const config = vs.workspace.getConfiguration('bracket-jumper')
    
    LEFT = config.get<string[]>('openingBrackets')
    RIGHT = config.get<string[]>('closingBrackets')
    LAND_INSIDE = config.get<boolean>('landInside')
}