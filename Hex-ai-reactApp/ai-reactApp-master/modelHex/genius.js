export function evaluateBoard(board, playerId) {
    board = JSON.parse(JSON.stringify(board))
    const boardSize = board.length;
  
    // Calculate control score
    const controlScore = calculateControl(board, playerId);
  
    // Calculate connectivity score
    const connectivityScore = calculateConnectivity(board, playerId);
  
    // Calculate shortest distance to goal sides
    const shortestDistance = calculateShortestDistance(board, playerId);
  
    // Calculate final evaluation score
    const evaluationScore = controlScore*(1.5) + connectivityScore*(0.5) + (boardSize - shortestDistance);
  
    return evaluationScore;
  }
  
  // Helper function to calculate control score
  function calculateControl(board, playerId) {
    const boardSize = board.length;
    let controlScore = 0;
  
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === playerId) {
          // Increase control score for player's positions closer to opponent's goal sides
          if (playerId === '1') {
            controlScore += i;
          } else {
            controlScore += boardSize - 1 - j;
          }
        }
      }
    }
  
    return controlScore;
  }
  
  // Helper function to calculate connectivity score
  function calculateConnectivity(board, playerId) {
    const boardSize = board.length;
    const visited = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
    let connectivityScore = 0;
  
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === playerId && !visited[i][j]) {
          dfs(board, i, j, playerId, visited);
          connectivityScore++;
        }
      }
    }
  
    return connectivityScore;
  }
  
  // Helper function for depth-first search (DFS)
  function dfs(board, row, col, playerId, visited) {
    const boardSize = board.length;
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
      [-1, 1], // Top-right
      [1, -1], // Bottom-left
    ];
  
    visited[row][col] = true;
  
    for (let [dx, dy] of directions) {
      let newRow = row + dx;
      let newCol = col + dy;
  
      if (isValidPosition(newRow, newCol, boardSize) && board[newRow][newCol] === playerId && !visited[newRow][newCol]) {
        dfs(board, newRow, newCol, playerId, visited);
      }
    }
  }
  
  // Helper function to check if a position is valid on the board
  function isValidPosition(row, col, boardSize) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  }
  
  // Helper function to calculate the shortest distance to goal sides for a player
  function calculateShortestDistance(board, playerId) {
    const boardSize = board.length;
    const goalSides = playerId === '1' ? ['top', 'bottom'] : ['left', 'right'];
    const distances = Array.from({ length: boardSize }, () => Array(boardSize).fill(Infinity));
  
    // Initialize distances to 0 for positions on goal sides
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === playerId && (goalSides.includes('top') && i === 0 || goalSides.includes('bottom') && i === boardSize - 1 ||
          goalSides.includes('left') && j === 0 || goalSides.includes('right') && j === boardSize - 1)) {
          distances[i][j] = 0;
        }
      }
    }
  
    // Perform Dijkstra's algorithm to calculate shortest distances
    const queue = [];
  
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === playerId) {
          queue.push([i, j]);
        }
      }
    }
  
    while (queue.length > 0) {
      const [row, col] = queue.shift();
      const currDistance = distances[row][col] + 1;
  
      const directions = [
        [-1, 0], // Up
        [1, 0], // Down
        [0, -1], // Left
        [0, 1], // Right
        [-1, 1], // Top-right
        [1, -1], // Bottom-left
      ];
  
      for (let [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
  
        if (isValidPosition(newRow, newCol, boardSize) && distances[newRow][newCol] > currDistance) {
          distances[newRow][newCol] = currDistance;
          queue.push([newRow, newCol]);
        }
      }
    }
  
    // Find the minimum distance to goal sides
    let minDistance = Infinity;
  
    if (goalSides.includes('top')) {
      for (let j = 0; j < boardSize; j++) {
        minDistance = Math.min(minDistance, distances[0][j]);
      }
    }
  
    if (goalSides.includes('bottom')) {
      for (let j = 0; j < boardSize; j++) {
        minDistance = Math.min(minDistance, distances[boardSize - 1][j]);
      }
    }
  
    if (goalSides.includes('left')) {
      for (let i = 0; i < boardSize; i++) {
        minDistance = Math.min(minDistance, distances[i][0]);
      }
    }
  
    if (goalSides.includes('right')) {
      for (let i = 0; i < boardSize; i++) {
        minDistance = Math.min(minDistance, distances[i][boardSize - 1]);
      }
    }
  
    return minDistance;
  }