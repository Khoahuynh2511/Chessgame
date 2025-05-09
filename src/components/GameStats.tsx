import React from 'react';
import styles from '@/styles/GameStats.module.css';
import { Chess } from 'chess.js';

interface GameStatsProps {
  game: Chess;
  whiteTime: number;
  blackTime: number;
  moveCount: number;
  capturedPieces: {
    white: string[];
    black: string[];
  };
}

const GameStats: React.FC<GameStatsProps> = ({ 
  game, 
  whiteTime, 
  blackTime, 
  moveCount,
  capturedPieces 
}) => {
  // Hàm chuyển đổi giây sang định dạng thời gian
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Hàm chuyển đổi ký hiệu quân cờ thành Unicode
  const getPieceSymbol = (piece: string): string => {
    const symbols: Record<string, string> = {
      'p': '♙', // white pawn
      'n': '♘', // white knight
      'b': '♗', // white bishop
      'r': '♖', // white rook
      'q': '♕', // white queen
      'k': '♔', // white king
      'P': '♟', // black pawn
      'N': '♞', // black knight
      'B': '♝', // black bishop
      'R': '♜', // black rook
      'Q': '♛', // black queen
      'K': '♚', // black king
    };
    return symbols[piece] || piece;
  };

  // Hiển thị quân cờ bị bắt
  const renderCapturedPieces = (pieces: string[]) => {
    return pieces.map((piece, index) => (
      <span key={index} className={styles.capturedPiece}>
        {getPieceSymbol(piece)}
      </span>
    ));
  };

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.statsTitle}>Game Stats</h3>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Turn:</span>
        <span className={styles.statValue}>{game.turn() === 'w' ? 'White' : 'Black'}</span>
      </div>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Total Moves:</span>
        <span className={styles.statValue}>{moveCount}</span>
      </div>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Game Status:</span>
        <span className={styles.statValue}>
          {game.isCheckmate() ? 'Checkmate' : 
           game.isDraw() ? 'Draw' :
           game.isCheck() ? 'Check' : 'Ongoing'}
        </span>
      </div>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>White Time:</span>
        <span className={styles.statValue}>{formatTime(whiteTime)}</span>
      </div>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Black Time:</span>
        <span className={styles.statValue}>{formatTime(blackTime)}</span>
      </div>
      
      <div className={styles.capturedPiecesContainer}>
        <div className={styles.capturedSection}>
          <span className={styles.statLabel}>White captured:</span>
          <div className={styles.piecesRow}>
            {renderCapturedPieces(capturedPieces.white)}
          </div>
        </div>
        
        <div className={styles.capturedSection}>
          <span className={styles.statLabel}>Black captured:</span>
          <div className={styles.piecesRow}>
            {renderCapturedPieces(capturedPieces.black)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats; 