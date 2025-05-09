import React from 'react';
import styles from '@/styles/GameHistory.module.css';

interface HistoryItem {
  move: {
    from: string;
    to: string;
    promotion?: string;
    piece: string;
    color: 'w' | 'b';
    flags: string;
    captured?: string;
    san: string;
  };
  position: Record<string, any>;
}

interface GameHistoryProps {
  history: HistoryItem[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  // Group moves into pairs (white and black)
  const renderMoves = () => {
    const rows = [];
    let moveNumber = 1;
    let moveRow: { white?: string; black?: string } = {};
    
    for (let i = 0; i < history.length; i++) {
      const item = history[i];
      const { san, color } = item.move;
      
      if (color === 'w') {
        moveRow.white = san;
        if (i + 1 < history.length && history[i + 1].move.color === 'b') {
          // If there's a black move following, wait to render both
          continue;
        }
      } else if (color === 'b') {
        moveRow.black = san;
      }
      
      // Render row when we have a complete pair or a white move without a black follow-up
      rows.push(
        <tr key={`move-${moveNumber}`}>
          <td className={styles.moveNumber}>{moveNumber}.</td>
          <td className={styles.move}>{moveRow.white || ''}</td>
          <td className={styles.move}>{moveRow.black || ''}</td>
        </tr>
      );
      
      moveNumber++;
      moveRow = {};
    }
    
    return rows;
  };
  
  return (
    <div className={styles.historyContainer}>
      <h3>Move History</h3>
      <div className={styles.scrollContainer}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>White</th>
              <th>Black</th>
            </tr>
          </thead>
          <tbody>
            {renderMoves()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameHistory; 