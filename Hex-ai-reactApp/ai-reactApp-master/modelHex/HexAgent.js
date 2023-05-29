const Agent = require('ai-agents').Agent;
import { seeVirtualBoard } from './utils';
import { evaluateBoard } from './genius';
import { findBestMove } from './minmax';

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }

    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send() {
        let board = this.perception;
        let size = board.length;
        let available = getEmptyHex(board);
        let nTurn = size * size - available.length;
        console.log(nTurn)
        if (nTurn == 0) { // First move
            let move = [Math.floor(size / 2), Math.floor(size / 2) - 1] 
            let boardWithThatMove = seeVirtualBoard(board,move,'1')
            console.log("Board: ", boardWithThatMove)
            console.log("Evalution score (P1): ",evaluateBoard(boardWithThatMove,'1'))
            return move;
        } else if (nTurn == 1) {//second move
            let move;
            if (board[Math.floor(size / 2)][Math.floor(size / 2)] == 0){
                move = [Math.floor(size / 2), Math.floor(size / 2)]
            }else{
                throw Error
            }
            let boardWithThatMove = seeVirtualBoard(board,move,'2')
            console.log("Board: ", boardWithThatMove)
            console.log("Evalution score: (P2)",evaluateBoard(boardWithThatMove,'2'))
            return move;
        }

        if (nTurn % 2 == 1) {//player 2 human
            // var playerCords = prompt("Your cords in row,col format: ");
            // let move = [parseInt(playerCords[0]), parseInt(playerCords[2])]
            // let boardWithThatMove = seeVirtualBoard(board,move,'2')
            // console.log("Board: ", boardWithThatMove)
            // console.log("Evalution score: (P2)",evaluateBoard(board,'2'))
            //mahine playing, copy paste this block to get our solution :)
            let move = available[Math.round(Math.random() * (available.length - 1))];
            let randomCords = [Math.floor(move / board.length), move % board.length]
            return randomCords
        } else if (nTurn % 2 == 0) {//mahine playing, copy paste this block to get our solution :)
            //let move = available[Math.round(Math.random() * (available.length - 1))];
            //let machineCords = [Math.floor(move / board.length), move % board.length]
            let machineCords = findBestMove(JSON.parse(JSON.stringify(board)), 2)
            console.log("machine cords: ", machineCords)
            let boardWithThatMove = seeVirtualBoard(board,machineCords,'1')
            console.log("Board: ", boardWithThatMove)
            console.log("Evalution score: (P1)",evaluateBoard(board,'1'))
            return machineCords;
        }
    }

}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push(k * size + j);
            }
        }
    }
    return result;
}
