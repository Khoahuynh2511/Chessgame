import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Move } from 'chess.js';

// Các cấp độ khó của AI
export enum AILevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard'
}

interface UseChessAIOptions {
  game: Chess;
  level: AILevel;
  aiColor: 'w' | 'b';
  onMove?: (from: string, to: string, promotion?: string) => void;
}

interface UseChessAIReturn {
  isThinking: boolean;
  makeAIMove: () => void;
  setAILevel: (level: AILevel) => void;
  setAIColor: (color: 'w' | 'b') => void;
}

export const useChessAI = ({
  game,
  level = AILevel.Medium,
  aiColor = 'b',
  onMove
}: UseChessAIOptions): UseChessAIReturn => {
  const [aiLevel, setAILevel] = useState<AILevel>(level);
  const [computerColor, setAIColor] = useState<'w' | 'b'>(aiColor);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const gameRef = useRef(game);
  
  // Cập nhật gameRef khi game thay đổi
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  // Giả lập thời gian "suy nghĩ" dựa trên cấp độ
  const getThinkingTime = (): number => {
    switch (aiLevel) {
      case AILevel.Easy:
        return 300;
      case AILevel.Medium:
        return 500;
      case AILevel.Hard:
        return 800;
      default:
        return 500;
    }
  };

  // Đánh giá nước đi
  const evaluateMove = (move: Move, depth: number, currentGame: Chess): number => {
    const newGame = new Chess(currentGame.fen());
    
    try {
      // Apply the move using the from/to format instead of the move object directly
      newGame.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion
      });
      
      // Nếu là lá (độ sâu 0), trả về đánh giá trực tiếp
      if (depth === 0) {
        return evaluatePosition(newGame);
      }
      
      // Nếu kết thúc trò chơi - Kiểm tra bằng isCheckmate/isDraw/...
      if (newGame.isCheckmate() || newGame.isDraw()) {
        if (newGame.isCheckmate()) {
          // Chiếu hết - giá trị cao nhất hoặc thấp nhất tùy thuộc vào bên nào chiến thắng
          return newGame.turn() === computerColor ? -10000 : 10000;
        } else {
          // Hòa
          return 0;
        }
      }
      
      // Nếu chưa đến lá, áp dụng minimax đơn giản
      const nextMoves = newGame.moves({ verbose: true }) as Move[];
      let bestScore = newGame.turn() === computerColor ? -Infinity : Infinity;
      
      for (const nextMove of nextMoves) {
        const score = evaluateMove(nextMove, depth - 1, newGame);
        
        if (newGame.turn() === computerColor) {
          bestScore = Math.max(bestScore, score);
        } else {
          bestScore = Math.min(bestScore, score);
        }
      }
      
      return bestScore;
    } catch (error) {
      console.error('Error evaluating move:', error);
      return currentGame.turn() === computerColor ? -100 : 100; // Return a modest score on error
    }
  };

  // Đánh giá vị trí
  const evaluatePosition = (position: Chess): number => {
    const pieceValues: Record<string, number> = {
      p: 10,   // Tốt
      n: 30,   // Mã
      b: 30,   // Tượng
      r: 50,   // Xe
      q: 90,   // Hậu
      k: 0    // Vua - không tính điểm để tránh vấn đề với vua
    };
    
    let score = 0;
    const board = position.board();
    
    // Đánh giá dựa trên quân cờ
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const value = pieceValues[piece.type.toLowerCase()];
          score += piece.color === computerColor ? value : -value;
        }
      }
    }
    
    // Bonus cho việc kiểm soát trung tâm
    const centralSquares = ['d4', 'd5', 'e4', 'e5'];
    for (const sq of centralSquares) {
      const piece = position.get(sq);
      if (piece && piece.color === computerColor) {
        score += 5;
      }
    }
    
    // Đánh giá dựa trên số nước đi khả dụng
    const mobility = position.moves().length;
    score += position.turn() === computerColor ? mobility * 0.1 : -mobility * 0.1;
    
    // Kiểm tra chiếu và chiếu hết
    if (position.isCheck()) {
      if (position.turn() !== computerColor) {
        // Đang chiếu vua đối phương
        score += 50;
      }
    }
    
    return score;
  };
  
  // Kiểm tra khả năng nhập thành - chỉ sử dụng để khuyến khích AI nhập thành
  const canCastle = (position: Chess, color: string): boolean => {
    // Kiểm tra qua nước đi hợp lệ
    const moves = position.moves({verbose: true}) as Move[];
    return moves.some(move => move.flags && (move.flags.includes('k') || move.flags.includes('q')));
  };

  // Tìm nước đi tốt nhất
  const findBestMove = (currentGame = gameRef.current): { from: string; to: string; promotion?: string } | null => {
    // Đảm bảo là lượt của AI và trò chơi chưa kết thúc
    if (currentGame.turn() !== computerColor || 
        currentGame.isCheckmate() || 
        currentGame.isDraw() || 
        currentGame.isStalemate()) {
      console.warn("AI không thể di chuyển vì không phải lượt hoặc trò chơi đã kết thúc");
      return null;
    }
    
    const moves = currentGame.moves({ verbose: true }) as Move[];
    if (moves.length === 0) {
      console.warn("AI không có nước đi hợp lệ nào");
      return null;
    }
    
    // Độ sâu tìm kiếm dựa trên cấp độ
    const searchDepth = 
      aiLevel === AILevel.Easy ? 1 :
      aiLevel === AILevel.Medium ? 1 :
      2;
    
    let bestMove: Move | null = null;
    let bestScore = -Infinity;
    
    // Đánh giá từng nước đi
    for (const move of moves) {
      // Đánh giá nhanh cho cấp độ Easy và Medium
      if (aiLevel === AILevel.Easy || aiLevel === AILevel.Medium) {
        // Đánh giá đơn giản dựa trên giá trị của nước đi
        let score = 0;
        
        // Ưu tiên nước bắt quân
        if ('captured' in move && move.captured) {
          const pieceValues: Record<string, number> = {
            p: 10, n: 30, b: 30, r: 50, q: 90, k: 0
          };
          score += pieceValues[(move.captured as string).toLowerCase()] * 10;
        }
        
        // Ưu tiên phong cấp
        if (move.promotion) {
          score += 50;
        }
        
        // Ưu tiên chiếu
        if (move.san && move.san.includes('+')) {
          score += 10;
        }
        
        // Ưu tiên chiếu hết
        if (move.san && move.san.includes('#')) {
          score += 100;
        }
        
        // Ưu tiên nước nhập thành
        if (move.flags && (move.flags.includes('k') || move.flags.includes('q'))) {
          score += 30;
        }
        
        // Thêm yếu tố ngẫu nhiên
        if (aiLevel === AILevel.Easy) {
          score += Math.random() * 30; // Thêm ngẫu nhiên nhiều hơn cho Easy
        } else {
          score += Math.random() * 10; // Thêm một chút ngẫu nhiên cho Medium
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        // Hard level - dùng Minimax có giới hạn độ sâu
        const score = evaluateMove(move, searchDepth, currentGame);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }
    
    // Đối với cấp độ Easy, có xác suất chọn nước đi ngẫu nhiên
    if (aiLevel === AILevel.Easy && Math.random() > 0.7) {
      bestMove = moves[Math.floor(Math.random() * moves.length)];
    }
    
    return bestMove ? { 
      from: bestMove.from, 
      to: bestMove.to,
      promotion: bestMove.promotion 
    } : null;
  };

  // Thực hiện nước đi AI được đóng gói bằng useCallback để có thể sử dụng trong dependencies
  const makeAIMove = useCallback(() => {
    const currentGame = gameRef.current;
    
    // Đảm bảo là lượt của AI và trò chơi chưa kết thúc
    if (currentGame.turn() !== computerColor || 
        currentGame.isCheckmate() || 
        currentGame.isDraw() || 
        currentGame.isStalemate()) {
      console.warn("Không thể thực hiện nước đi AI - Không phải lượt hoặc trò chơi đã kết thúc");
      console.log("Lượt hiện tại:", currentGame.turn(), "Màu AI:", computerColor);
      console.log("Trạng thái: Checkmate:", currentGame.isCheckmate(), "Draw:", currentGame.isDraw());
      return;
    }
    
    // Đánh dấu AI đang suy nghĩ
    setIsThinking(true);
    console.log("AI đang suy nghĩ...");
    
    // Mô phỏng "suy nghĩ"
    setTimeout(() => {
      // Tìm nước đi tốt nhất
      const bestMove = findBestMove(currentGame);
      
      if (bestMove) {
        console.log("AI đã tìm thấy nước đi tốt nhất:", bestMove);
        
        try {
          // Nếu có callback onMove, sử dụng nó để thực hiện nước đi
          if (onMove) {
            console.log("Thực hiện nước đi thông qua callback:", bestMove);
            onMove(bestMove.from, bestMove.to, bestMove.promotion);
          } else {
            // Nếu không có callback, trực tiếp thực hiện nước đi
            console.log("Thực hiện nước đi trực tiếp:", bestMove);
            
            const result = currentGame.move({
              from: bestMove.from,
              to: bestMove.to,
              promotion: bestMove.promotion || undefined
            });
            
            console.log("Kết quả nước đi:", result);
          }
        } catch (error) {
          console.error("Lỗi khi thực hiện nước đi AI:", error);
        }
      } else {
        console.warn("AI không tìm được nước đi hợp lệ");
      }
      
      // Kết thúc suy nghĩ
      setIsThinking(false);
    }, getThinkingTime());
  }, [computerColor, aiLevel, onMove]);

  // Tự động đi khi thay đổi AI color
  useEffect(() => {
    setAIColor(aiColor);
  }, [aiColor]);

  // Tự động đi khi thay đổi AI level
  useEffect(() => {
    setAILevel(level);
  }, [level]);

  return {
    isThinking,
    makeAIMove,
    setAILevel,
    setAIColor
  };
}; 