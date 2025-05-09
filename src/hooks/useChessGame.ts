import { useState, useEffect } from 'react';
import { Chess, Move as ChessMove } from 'chess.js';

// Mở rộng kiểu Move để bao gồm thuộc tính 'captured'
interface ExtendedMove extends Partial<ChessMove> {
  from: string;
  to: string;
  color: 'w' | 'b';
  flags: string;
  captured?: string;
  san?: string;
}

interface MoveHistory {
  move: ExtendedMove;
  position: Record<string, { type: string; color: string }>;
}

export const useChessGame = () => {
  const [game] = useState<Chess>(new Chess());
  const [currentPosition, setCurrentPosition] = useState<Record<string, { type: string; color: string }>>({});
  const [history, setHistory] = useState<MoveHistory[]>([]);
  
  // Cập nhật vị trí khi component được mount
  useEffect(() => {
    updatePosition();
  }, []);
  
  // Hàm cập nhật vị trí hiện tại
  const updatePosition = () => {
    const position: Record<string, { type: string; color: string }> = {};
    
    // Lấy vị trí hiện tại từ game
    const board = game.board();
    
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const file = 'abcdefgh'[f];
          const rank = 8 - r;
          const square = `${file}${rank}`;
          
          position[square] = {
            type: piece.type,
            color: piece.color
          };
        }
      }
    }
    
    setCurrentPosition(position);
  };
  
  // Thực hiện nước đi
  const makeMove = (from: string, to: string, promotion?: string) => {
    try {
      // Tạo đối tượng nước đi
      const moveObj: {
        from: string;
        to: string;
        promotion?: string;
      } = {
        from,
        to
      };
      
      // Thêm promotion nếu có
      if (promotion) {
        moveObj.promotion = promotion;
      }
      
      // Thực hiện nước đi
      const moveResult = game.move(moveObj) as unknown as ExtendedMove;
      
      if (moveResult) {
        // Cập nhật vị trí
        updatePosition();
        
        // Cập nhật lịch sử
        setHistory(prev => [
          ...prev,
          {
            move: {
              from: moveResult.from,
              to: moveResult.to,
              color: moveResult.color,
              flags: moveResult.flags,
              captured: moveResult.captured,
              san: moveResult.san
            },
            position: { ...currentPosition }
          }
        ]);
        
        return moveResult;
      }
      
      return false;
    } catch (error) {
      console.error('Error making move:', error);
      return false;
    }
  };
  
  // Đi lại nước trước đó
  const undo = () => {
    // Kiểm tra xem có thể đi lại hay không
    if (game.history().length > 0) {
      // Đi lại nước trước đó
      game.undo();
      
      // Cập nhật vị trí
      updatePosition();
      
      // Cập nhật lịch sử
      setHistory(prev => prev.slice(0, -1));
      
      return true;
    }
    
    return false;
  };
  
  // Reset game
  const reset = () => {
    game.reset();
    updatePosition();
    setHistory([]);
  };
  
  // Kiểm tra xem nước đi có phải là nước phong cấp không
  const isPromotion = (from: string, to: string): boolean => {
    // Lấy quân cờ tại vị trí from
    const piece = game.get(from);
    
    // Nếu không phải là quân tốt, không thể phong cấp
    if (!piece || piece.type !== 'p') {
      return false;
    }
    
    // Kiểm tra xem quân tốt có đến hàng cuối cùng không
    const rank = to.charAt(1);
    return (piece.color === 'w' && rank === '8') || (piece.color === 'b' && rank === '1');
  };
  
  return {
    game,
    currentPosition,
    turn: game.turn(),
    makeMove,
    undo,
    reset,
    history,
    isPromotion
  };
}; 