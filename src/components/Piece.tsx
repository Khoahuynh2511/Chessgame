import React from 'react';
import styles from '@/styles/Piece.module.css';

interface PieceType {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
}

interface PieceProps {
  piece: PieceType;
}

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const { type, color } = piece;
  
  // Map piece types to Unicode chess symbols
  const pieceSymbols: Record<string, string> = {
    'wp': '♙', // white pawn
    'wn': '♘', // white knight
    'wb': '♗', // white bishop
    'wr': '♖', // white rook
    'wq': '♕', // white queen
    'wk': '♔', // white king
    'bp': '♟', // black pawn
    'bn': '♞', // black knight
    'bb': '♝', // black bishop
    'br': '♜', // black rook
    'bq': '♛', // black queen
    'bk': '♚', // black king
  };
  
  const pieceKey = `${color}${type}`;
  const pieceSymbol = pieceSymbols[pieceKey];
  
  return (
    <div className={`${styles.piece} ${styles[pieceKey]}`}>
      {pieceSymbol}
    </div>
  );
};

export default Piece; 