declare module 'react-chess-pieces' {
  import * as React from 'react';
  
  export interface PieceProps {
    piece: string;
    size?: number;
    style?: React.CSSProperties;
    className?: string;
  }
  
  export const Piece: React.FC<PieceProps>;
} 