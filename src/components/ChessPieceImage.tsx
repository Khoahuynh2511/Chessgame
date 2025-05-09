import React from 'react';
import styles from '@/styles/Piece.module.css';

interface PieceType {
  type: string;
  color: string;
}

interface ChessPieceImageProps {
  piece: PieceType;
}

const ChessPieceImage: React.FC<ChessPieceImageProps> = ({ piece }) => {
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
  
  // Create the piece key from color and type
  const pieceKey = `${color}${type}`;
  const pieceSymbol = pieceSymbols[pieceKey];
  
  return (
    <div className={styles.piece}>
      <span className={color === 'w' ? styles.whitePiece : styles.blackPiece} style={{ fontSize: '2.5rem' }}>
        {pieceSymbol}
      </span>
    </div>
  );
};

export default ChessPieceImage; 