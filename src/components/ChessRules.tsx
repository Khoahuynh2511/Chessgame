import React, { useState } from 'react';
import styles from '@/styles/ChessRules.module.css';

interface ChessRulesProps {
  onClose: () => void;
}

const ChessRules: React.FC<ChessRulesProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('basic');

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className={styles.ruleContent}>
            <h3>Basic Rules</h3>
            <ul>
              <li>Chess is played on an 8×8 square board with 64 squares alternating between light and dark.</li>
              <li>Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 knights, 2 bishops, and 8 pawns.</li>
              <li>White always moves first, after which players alternate turns.</li>
              <li>A piece can be moved to an empty square or to capture an opponent's piece.</li>
              <li>The objective is to checkmate your opponent's king.</li>
            </ul>
          </div>
        );
      case 'pieces':
        return (
          <div className={styles.ruleContent}>
            <h3>Piece Movements</h3>
            <ul>
              <li><strong>King:</strong> Moves one square in any direction.</li>
              <li><strong>Queen:</strong> Moves any number of squares diagonally, horizontally, or vertically.</li>
              <li><strong>Rook:</strong> Moves any number of squares horizontally or vertically.</li>
              <li><strong>Bishop:</strong> Moves any number of squares diagonally.</li>
              <li><strong>Knight:</strong> Moves in an L-shape: two squares horizontally or vertically and then one square perpendicular to that direction.</li>
              <li><strong>Pawn:</strong> Moves forward one square, but captures diagonally. On its first move, a pawn may move two squares forward.</li>
            </ul>
          </div>
        );
      case 'special':
        return (
          <div className={styles.ruleContent}>
            <h3>Special Moves</h3>
            <ul>
              <li><strong>Castling:</strong> The king moves two squares toward a rook, and the rook moves to the square the king crossed. This is only permitted if neither piece has moved, there are no pieces between them, the king is not in check, and the king does not pass through or land on a square that is attacked.</li>
              <li><strong>En Passant:</strong> When a pawn moves two squares forward from its starting position and lands beside an opponent's pawn, the opponent can capture it as if it had moved only one square forward.</li>
              <li><strong>Pawn Promotion:</strong> When a pawn reaches the opponent's back rank, it must be promoted to a queen, rook, bishop, or knight.</li>
            </ul>
          </div>
        );
      case 'check':
        return (
          <div className={styles.ruleContent}>
            <h3>Check, Checkmate, & Stalemate</h3>
            <ul>
              <li><strong>Check:</strong> When a king is under threat of capture. A player must get out of check on their next move.</li>
              <li><strong>Checkmate:</strong> When a king is in check and there is no way to get out of check. The game ends, and the player whose king is checkmated loses.</li>
              <li><strong>Stalemate:</strong> When a player is not in check but has no legal moves. The game ends in a draw.</li>
            </ul>
          </div>
        );
      case 'draw':
        return (
          <div className={styles.ruleContent}>
            <h3>Draw Conditions</h3>
            <ul>
              <li><strong>Stalemate:</strong> When a player has no legal moves but is not in check.</li>
              <li><strong>Insufficient Material:</strong> When neither player has enough pieces to checkmate (e.g., king vs king).</li>
              <li><strong>Threefold Repetition:</strong> When the same position occurs three times with the same player to move.</li>
              <li><strong>50-Move Rule:</strong> When no pawn has been moved and no piece has been captured in the last 50 moves by each player.</li>
              <li><strong>Agreement:</strong> When both players agree to a draw.</li>
            </ul>
          </div>
        );
      case 'notation':
        return (
          <div className={styles.ruleContent}>
            <h3>Chess Notation</h3>
            <ul>
              <li><strong>Algebraic Notation:</strong> The standard method to record chess moves.</li>
              <li>Files (columns) are labeled a-h from left to right.</li>
              <li>Ranks (rows) are labeled 1-8 from bottom to top.</li>
              <li>Pieces are represented by their first letter (K=King, Q=Queen, R=Rook, B=Bishop, N=Knight). Pawns don't have a letter.</li>
              <li>A move is written as the piece letter plus the destination square (e.g., Nf3).</li>
              <li>Captures are indicated with an 'x' (e.g., Nxf3).</li>
              <li>Castling is written as O-O (kingside) or O-O-O (queenside).</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>International Chess Rules</h2>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'basic' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Rules
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'pieces' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('pieces')}
          >
            Pieces
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'special' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('special')}
          >
            Special Moves
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'check' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('check')}
          >
            Check & Mate
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'draw' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            Draw Rules
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'notation' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('notation')}
          >
            Notation
          </button>
        </div>
        
        <div className={styles.contentContainer}>
          {renderContent()}
        </div>
        
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessRules; 