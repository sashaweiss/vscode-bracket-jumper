'use strict';
import * as vs from 'vscode'

let LEFT = vs.workspace.getConfiguration('bracket-jumper').get<string[]>('openingBrackets')
let RIGHT = vs.workspace.getConfiguration('bracket-jumper').get<string[]>('closingBrackets')

/**
 * Get the character left or right of the given position
 * @param document the document to get from
 * @param pos the position to get at
 * @param dir the direction to get in
 */
function charAtPos(document: vs.TextDocument, pos: vs.Position): string {
    let line = document.lineAt(pos).text
    let ind = pos.character
    return line.substr(ind, 1)
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
    
    // Pesky edge case jumping right when current char is a bracket and last char in file
    if (dir == "right" && RIGHT.indexOf(charAtPos(doc, pos)) != -1) {
        return new vs.Position(pos.line, pos.character + 1)
    }

    // Hotfix for https://github.com/sashaweiss/vscode-bracket-jumper/issues/1
    if (posLeft(doc, pos) == null) { return null; }    

    // Pesky edge case jumping left when prev char is a left bracket, skips it otherwise
    if (dir == "left" && LEFT.indexOf(charAtPos(doc, posLeft(doc, pos))) != -1) {
        return posLeft(doc, pos)
    }

    // Skip examining current char if going left, otherwise gets stuck
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
                return dir == "left" ? pAdj : new vs.Position(pAdj.line, pAdj.character + 1) // Put us on the outside always
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

    // Pesky edge case jumping right when current char is a bracket and last char in file
    if (dir == "right" && RIGHT.indexOf(charAtPos(doc, pos)) != -1) {
        return new vs.Position(pos.line, pos.character + 1)
    }

    // Hotfix for https://github.com/sashaweiss/vscode-bracket-jumper/issues/1
    if (posLeft(doc, pos) == null) { return null; }

    // Pesky edge case jumping left when prev char is a left bracket, skips it otherwise
    if (dir == "left" && LEFT.indexOf(charAtPos(doc, posLeft(doc, pos))) != -1) {
        return posLeft(doc, pos)
    }

    // Skip examining current char if going left, otherwise gets stuck
    let pAdj = dir == "left" ? posLeft(doc, pos) : pos

    while ((pAdj = posFun(doc, pAdj))) {
        let char = charAtPos(doc, pAdj)

        if (LEFT.indexOf(char) != -1) {
             return pAdj
        }
        else if (RIGHT.indexOf(char) != -1) {
            return new vs.Position(pAdj.line, pAdj.character + 1)
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
}