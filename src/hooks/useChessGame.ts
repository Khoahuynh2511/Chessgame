import { useState, useCallback, useEffect } from 'react';
import { Chess, Move } from 'chess.js';

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

export const useChessGame = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Record<string, any>>(game.board());
  
  // Update position when game changes
  useEffect(() => {
    updatePosition();
  }, [game]);
  
  // Update the current position
  const updatePosition = useCallback(() => {
    const boardMap: Record<string, any> = {};
    const board = game.board();
    
    // Convert 2D array to object with coordinates as keys
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const file = String.fromCharCode(97 + f); // 'a' to 'h'
          const rank = 8 - r; // 1 to 8
          const square = `${file}${rank}`;
          
          boardMap[square] = {
            type: piece.type,
            color: piece.color
          };
        }
      }
    }
    
    setCurrentPosition(boardMap);
  }, [game]);
  
  // Make a move
  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    try {
      // Check if this is a legal move
      const moveOptions = { from, to, promotion };
      const moveResult = game.move(moveOptions);
      
      if (moveResult) {
        // Add move to history
        setHistory(prev => [
          ...prev,
          {
            move: {
              from: moveResult.from,
              to: moveResult.to,
              promotion: moveResult.promotion,
              piece: moveResult.piece,
              color: moveResult.color as 'w' | 'b',
              flags: moveResult.flags,
              captured: moveResult.captured as string | undefined,
              san: moveResult.san
            },
            position: { ...currentPosition }
          }
        ]);
        
        // Update position
        updatePosition();
        
        return moveResult;
      }
      
      return false;
    } catch (e) {
      console.error('Invalid move:', e);
      return false;
    }
  }, [game, currentPosition, updatePosition]);
  
  // Undo the last move
  const undo = useCallback(() => {
    try {
      game.undo();
      
      // Remove the last move from history
      setHistory(prev => prev.slice(0, -1));
      
      // Update position
      updatePosition();
      
      return true;
    } catch (e) {
      console.error('Could not undo:', e);
      return false;
    }
  }, [game, updatePosition]);
  
  // Reset the game
  const reset = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setHistory([]);
    setCurrentPosition(newGame.board());
  }, []);
  
  // Check if a move is a pawn promotion
  const isPromotion = useCallback((from: string, to: string): boolean => {
    try {
      // Get the piece at the 'from' square
      const piece = game.get(from);
      
      if (!piece || piece.type !== 'p') {
        return false;
      }
      
      // Check if the move is to the last rank (1 for black, 8 for white)
      const toRank = to.charAt(1);
      return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
    } catch (e) {
      console.error('Error checking promotion:', e);
      return false;
    }
  }, [game]);
  
  // Get threefold repetition status
  const isThreefoldRepetition = useCallback((): boolean => {
    return game.isThreefoldRepetition();
  }, [game]);
  
  // Get 50-move rule status
  const isFiftyMoveDraw = useCallback((): boolean => {
    return game.isDraw() && !game.isCheckmate() && !game.isStalemate() && !game.isThreefoldRepetition();
  }, [game]);
  
  // Get insufficient material draw status
  const isInsufficientMaterial = useCallback((): boolean => {
    return game.isDraw() && !game.isCheckmate() && !game.isStalemate() && !game.isThreefoldRepetition() && !isFiftyMoveDraw();
  }, [game, isFiftyMoveDraw]);
  
  // Check if a move results in en passant capture
  const isEnPassant = useCallback((from: string, to: string): boolean => {
    try {
      // Check if this is a legal move
      const moves = game.moves({ verbose: true }) as Move[];
      const move = moves.find(m => m.from === from && m.to === to);
      return move ? move.flags.includes('e') : false;
    } catch (e) {
      console.error('Error checking en passant:', e);
      return false;
    }
  }, [game]);
  
  // Check if a move is a castling move
  const isCastling = useCallback((from: string, to: string): boolean => {
    try {
      // Check if this is a legal move
      const moves = game.moves({ verbose: true }) as Move[];
      const move = moves.find(m => m.from === from && m.to === to);
      return move ? (move.flags.includes('k') || move.flags.includes('q')) : false;
    } catch (e) {
      console.error('Error checking castling:', e);
      return false;
    }
  }, [game]);
  
  // Get the legal moves for a specific square
  const getLegalMovesForSquare = useCallback((square: string) => {
    try {
      const moves = game.moves({ square, verbose: true }) as Move[];
      return moves.map(move => move.to);
    } catch (e) {
      console.error('Error getting legal moves:', e);
      return [];
    }
  }, [game]);
  
  // Check if king is in check
  const isCheck = useCallback((): boolean => {
    return game.isCheck();
  }, [game]);
  
  // Get current FEN notation
  const getFen = useCallback((): string => {
    return game.fen();
  }, [game]);
  
  // Get current PGN notation
  const getPgn = useCallback((): string => {
    return game.pgn();
  }, [game]);
  
  // Check if game is over
  const isGameOver = useCallback((): boolean => {
    return game.isCheckmate() || game.isDraw() || game.isStalemate() || game.isThreefoldRepetition();
  }, [game]);
  
  return {
    game,
    currentPosition,
    turn: game.turn(),
    history,
    isGameOver,
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    isStalemate: game.isStalemate(),
    isThreefoldRepetition,
    isFiftyMoveDraw,
    isInsufficientMaterial,
    isCheck,
    makeMove,
    undo,
    reset,
    isPromotion,
    isEnPassant,
    isCastling,
    getLegalMovesForSquare,
    getFen,
    getPgn
  };
}; 