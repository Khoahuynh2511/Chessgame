// Chess types
export interface PieceType {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
}

// Module declarations should be in separate files
// Moving CSS module declaration to css-modules.d.ts
// Moving chess.js declaration to chess-js.d.ts
// Moving react-chess-pieces declaration to react-chess-pieces.d.ts 