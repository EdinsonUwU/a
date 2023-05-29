// import { evaluateBoard } from "./evaluateBoard";
//import { evaluateBoard } from "./djisktra";
import { evaluateBoard } from "./genius";
import { seeVirtualBoard } from "./utils";
import { possibleMoves } from "./utils";
import { gameIsOver } from "./utils";
// Minimax function with alpha-beta pruning
function minimax(board, depth, maximizingPlayer, alpha, beta) {//colocar el id del jugador a hallar el maximo score como parametro
  //console.log(board)
  // Base case: If the game is over or maximum depth is reached
  // return the evaluation score of the board
  if (depth === 0 || gameIsOver(board)) {
    return evaluateBoard(board,'1');//colocar el id del jugador a hallar la evaluacion como parametro
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let move of possibleMoves(board)) {
      let newBoard = seeVirtualBoard(JSON.parse(JSON.stringify(board)), move, '2');
      let value = minimax(newBoard, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, value);
      alpha = Math.max(alpha, value);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of possibleMoves(board)) {
      let newBoard = seeVirtualBoard(JSON.parse(JSON.stringify(board)), move,'1');
      let value = minimax(newBoard, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, value);
      beta = Math.min(beta, value);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}

// Function to find the best move for the AI player using Minimax
export function findBestMove(board, depth) {
  let bestEval = -Infinity;
  let bestMove;
  console.log("first board: ",board)
  //o cambiar makeMove, sale mejor?
  for (let move of possibleMoves(board)) {//crear una funcion possibleMoves que traduzca getEmptyHex en vez de ids, cords [row,col]
    let newBoard = seeVirtualBoard(JSON.parse(JSON.stringify(board)), move,'1');
    //console.log("newBoard: ", newBoard)
    let value = minimax(newBoard, depth - 1, false, -Infinity, Infinity);

    if (value > bestEval) {
      bestEval = value;
      bestMove = move;
    }
  }

  return bestMove;
}
