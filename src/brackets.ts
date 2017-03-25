'use strict';
import * as vs from 'vscode'

const LEFT = ["{", "(", "["] // Everything in LEFT must have...
const RIGHT = ["}", ")", "]"] // a closing match in RIGHT.

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
 * @returns the position one step left, or null if first
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
    return offset < document.getText().length - 1 ? document.positionAt(offset + 1) : null
}

/**
 * The position of the nearest enclosing unmatched bracket, in the given direction.
 * @param document the document to search
 * @param pos the position to search from
 */
export function bracketPosInDir(document: vs.TextDocument, pos: vs.Position, dir: "left" | "right"): vs.Position | null {
    let [des, pair] = dir == "left" ? [LEFT, RIGHT] : [RIGHT, LEFT]
    let posFun = dir == "left" ? posLeft : posRight
    
    let pAdj = dir == "left" ? posFun(document, pos) : pos // If going left, skip examining current char
    let paired = Array<number>(LEFT.length).fill(0)

    while ((pAdj = posFun(document, pAdj))) {
        let char = charAtPos(document, pAdj)
        
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