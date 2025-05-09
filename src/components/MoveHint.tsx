import React from 'react';
import { Chess } from 'chess.js';
import styles from '@/styles/MoveHint.module.css';

interface MoveHintProps {
  game: Chess;
  onSelectMove: (from: string, to: string) => void;
}

// Hàm đánh giá nước đi (đơn giản)
const evaluateMove = (game: Chess, move: any): number => {
  const newGame = new Chess(game.fen());
  newGame.move(move);
  
  let score = 0;
  
  // Kiểm tra nếu nước đi tạo ra chiếu tướng
  if (newGame.isCheckmate()) {
    return 1000; // Ưu tiên cao nhất cho chiếu hết
  }
  
  // Kiểm tra nếu nước đi tạo ra chiếu
  if (newGame.isCheck()) {
    score += 50;
  }
  
  // Đánh giá dựa trên giá trị quân cờ bị bắt
  const pieceValues: Record<string, number> = {
    p: 1,   // Tốt
    n: 3,   // Mã
    b: 3,   // Tượng
    r: 5,   // Xe
    q: 9,   // Hậu
    k: 0    // Vua (không đánh giá bắt Vua)
  };
  
  if (move.captured) {
    score += pieceValues[move.captured.toLowerCase()] * 10;
  }
  
  // Ưu tiên việc kiểm soát trung tâm bàn cờ
  const centralSquares = ['d4', 'd5', 'e4', 'e5'];
  if (centralSquares.includes(move.to)) {
    score += 5;
  }
  
  return score;
};

const MoveHint: React.FC<MoveHintProps> = ({ game, onSelectMove }) => {
  // Lấy tất cả các nước đi hợp lệ
  const moves = game.moves({ verbose: true }) as any[];
  
  // Đánh giá và sắp xếp các nước đi
  const ratedMoves = moves
    .map(move => ({
      ...move,
      score: evaluateMove(game, move)
    }))
    .sort((a, b) => b.score - a.score);
  
  // Lấy 3 nước đi tốt nhất
  const bestMoves = ratedMoves.slice(0, 3);
  
  return (
    <div className={styles.hintContainer}>
      <h3 className={styles.hintTitle}>Suggested Moves</h3>
      {bestMoves.length > 0 ? (
        <div className={styles.movesList}>
          {bestMoves.map((move, index) => (
            <div 
              key={index} 
              className={styles.moveItem}
              onClick={() => onSelectMove(move.from, move.to)}
            >
              <span className={styles.moveRank}>{index + 1}.</span>
              <span className={styles.moveSan}>{move.san}</span>
              <span className={styles.moveScore}>
                {move.score > 100 ? '++' : move.score > 50 ? '+' : '='}
              </span>
              <button className={styles.playButton}>▶</button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noMoves}>No legal moves available</div>
      )}
    </div>
  );
};

export default MoveHint; 