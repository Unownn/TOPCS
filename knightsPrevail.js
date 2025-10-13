class ChessBoard {
  constructor(size){
    this.size = size; 
    this.possibleMoves = [[2, -1],[2, 1],[-2, -1],[-2, 1],[-1, 2],[-1, -2],[1, 2],[1, -2]];
  }

  // Knight moves
  knightMoves(start, end) {
    // Helpers to shorten some checks. 
    // Bounds -> check if the coordinates go outside the board
    // Key -> Make a coordinate into a string
    // Same -> check if two coordinates are the same, as in JS [0, 0] == [0, 0] = false
    const inBounds = ([x,y]) => x >= 0 && x < this.size && y >= 0 && y < this.size;
    const toKey = ([x,y]) => `${x},${y}`;
    const same = (a, b) => a[0] === b[0] && a[1] === b[1];

    // Variables to track progress
    // q -> move queue
    // Seen -> a set to contain the unique locations visited
    // parent -> a map to contain move to move combinations. Can be used to "walk back" from end to start
    const q = [start];
    const seen = new Set([toKey(start)]);
    const parent = new Map();

    // Start moving the knight
    while (q.length) {
      const cur = q.shift();

      // Reconstruct the path when end is reached
      if (same(cur, end)) {
        const path = [];
        let k = toKey(cur);
        while (k) {
          const [sx, sy] = k.split(',').map(Number);
          path.push([sx, sy]);
          k = parent.get(k);
        }

        // Return the path
        return path.reverse();
      }

      // Check the coming moves
      for (const mv of this.possibleMoves) {
        const nxt = [cur[0] + mv[0], cur[1] + mv[1]];

        // Skip invalid moves
        if (!inBounds(nxt)) continue;

        // Skip already seen positions
        const k = toKey(nxt);
        if (seen.has(k)) continue;

        // Add move to seen and add pair to map and set the next move to the queue
        seen.add(k);
        parent.set(k, toKey(cur));
        q.push(nxt);
      }
    }

    // If this point is reached, the position is unreachable
    return null; 
  }
}

const board = new ChessBoard(8);
console.log(board.knightMoves([3, 3], [4, 3]));