import React, { useState, useEffect } from 'react';
import { Chess, Move } from 'chess.js';
import ChessPieceImage from './ChessPieceImage';
import Square from './Square';
import GameHistory from './GameHistory';
import PromotionModal from './PromotionModal';
import GameStats from './GameStats';
import MoveHint from './MoveHint';
import Timer from './Timer';
import GameSettings from './GameSettings';
import ChessRules from './ChessRules';
import { useChessGame } from '@/hooks/useChessGame';
import { useChessAI, AILevel } from '@/hooks/useChessAI';
import useChessSound from '@/hooks/useChessSound';
import useChessTheme from '@/hooks/useChessTheme';
import styles from '@/styles/ChessBoard.module.css';

interface MoveResult {
  captured?: string;
  flags: string;
}

// Game state enum
enum GameState {
  SETUP, // Initial setup, before game starts
  PLAYING, // Game in progress
  PAUSED, // Game paused
  ENDED // Game ended (checkmate, draw, etc.)
}

// Game mode enum
enum GameMode {
  SINGLE_PLAYER, // 1 người chơi với máy
  TWO_PLAYERS // 2 người chơi với nhau
}

const ChessBoard: React.FC = () => {
  const { game, makeMove, reset, undo, currentPosition, turn, history, isPromotion } = useChessGame();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [pendingMove, setPendingMove] = useState<{from: string, to: string} | null>(null);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  
  // Game mode
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.TWO_PLAYERS);
  
  // Game settings
  const [initialTime, setInitialTime] = useState<number>(600); // 10 minutes
  const [whiteTime, setWhiteTime] = useState<number>(initialTime);
  const [blackTime, setBlackTime] = useState<number>(initialTime);
  const [boardTheme, setBoardTheme] = useState<string>('classic');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Game stats
  const [moveCount, setMoveCount] = useState<number>(0);
  const [capturedPieces, setCapturedPieces] = useState<{white: string[], black: string[]}>({
    white: [],
    black: []
  });
  
  // AI settings
  const [aiLevel, setAILevel] = useState<AILevel>(AILevel.Medium);
  const [aiColor, setAIColor] = useState<'w' | 'b'>('b');
  
  // Timer active states
  const [isWhiteTimerActive, setIsWhiteTimerActive] = useState<boolean>(false);
  const [isBlackTimerActive, setIsBlackTimerActive] = useState<boolean>(false);
  
  // Hook for AI
  const { isThinking, makeAIMove } = useChessAI({
    game,
    level: aiLevel,
    aiColor,
    onMove: (from, to, promotion) => {
      if (gameState === GameState.PLAYING) {
        console.log("AI di chuyển từ", from, "đến", to, promotion ? `với phong cấp ${promotion}` : '');
        
        try {
          // Thực hiện nước đi trực tiếp thay vì qua handleSquareClick
          const result = makeMove(from, to, promotion) as MoveResult | boolean;
          
          if (result) {
            // Cập nhật UI để phản ánh nước đi của AI
            setLastMove({ from, to });
            setMoveCount(prev => prev + 1);
            
            // Phát âm thanh phù hợp
            if (typeof result !== 'boolean' && result.captured) {
              playCaptureSound();
              // Cập nhật quân bị bắt
              setCapturedPieces(prev => {
                const piece = result.captured as string;
                const color = game.turn() === 'w' ? 'black' : 'white';
                return {
                  ...prev,
                  [color]: [...prev[color], piece]
                };
              });
            } else if (typeof result !== 'boolean' && result.flags && (result.flags.includes('k') || result.flags.includes('q'))) {
              playCastleSound();
            } else if (promotion) {
              playPromotionSound();
            } else {
              playMoveSound();
            }
            
            // Kiểm tra trạng thái trò chơi
            if (game.isCheckmate()) {
              playCheckmateSound();
              setGameState(GameState.ENDED);
            } else if (game.isDraw()) {
              playDrawSound();
              setGameState(GameState.ENDED);
            } else if (game.isCheck()) {
              playCheckSound();
            }
          } else {
            console.error("AI thực hiện nước đi không hợp lệ:", from, to, promotion);
          }
        } catch (error) {
          console.error("Lỗi khi xử lý nước đi của AI:", error);
        }
      }
    }
  });
  
  // Hook for sounds
  const { 
    playMoveSound, 
    playCaptureSound, 
    playCheckSound, 
    playCheckmateSound,
    playCastleSound,
    playDrawSound,
    playPromotionSound
  } = useChessSound({ enabled: soundEnabled });
  
  // Hook for theming
  const { getSquareStyles, getBoardStyle } = useChessTheme(boardTheme);

  // Update timer active states based on turn and game state
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      // Đảm bảo bộ đếm luôn hoạt động trong lượt, bất kể AI có đang suy nghĩ hay không
      setIsWhiteTimerActive(turn === 'w');
      setIsBlackTimerActive(turn === 'b');
    } else {
      // Nếu game không ở trạng thái PLAYING, dừng cả hai bộ đếm
      setIsWhiteTimerActive(false);
      setIsBlackTimerActive(false);
    }
  }, [turn, gameState]);

  // Trigger AI move when it's AI's turn in single player mode
  useEffect(() => {
    if (gameState === GameState.PLAYING && 
        gameMode === GameMode.SINGLE_PLAYER && 
        turn === aiColor && 
        !isThinking) {
      console.log("Kích hoạt nước đi của AI - lượt:", turn, "màu AI:", aiColor);
      // Sử dụng setTimeout với thời gian ngắn để tránh vấn đề với React re-rendering
      setTimeout(() => {
        makeAIMove();
      }, 100);
    }
  }, [gameState, gameMode, turn, aiColor, isThinking, makeAIMove]);

  // Toggle game mode
  const toggleGameMode = () => {
    if (gameState !== GameState.SETUP) {
      // Only allow changing game mode before game starts
      return;
    }
    
    setGameMode(prevMode => {
      const newMode = prevMode === GameMode.SINGLE_PLAYER ? GameMode.TWO_PLAYERS : GameMode.SINGLE_PLAYER;
      // Đặt AI color là ngược với màu người chơi trong khi chuyển đổi
      if (newMode === GameMode.SINGLE_PLAYER) {
        // Đặt AI là đen nếu người chơi hiện tại là trắng và ngược lại
        const currentTurn = game.turn();
        setAIColor(currentTurn === 'w' ? 'b' : 'w');
      }
      return newMode;
    });
  };

  // Start game
  const handleStartGame = () => {
    setGameState(GameState.PLAYING);
    // Reset timers to initial values when starting game
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    setMoveCount(0);
    setCapturedPieces({ white: [], black: [] });
    setLastMove(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    
    // If single player mode and AI goes first, trigger AI move
    if (gameMode === GameMode.SINGLE_PLAYER && turn === aiColor) {
      console.log("AI đi trước, kích hoạt nước đi đầu tiên...");
      // Slight delay to ensure game is in PLAYING state
      setTimeout(() => {
        makeAIMove();
      }, 200); // Giảm delay xuống còn 200ms
    }
  };
  
  // Pause game
  const handlePauseGame = () => {
    if (gameState === GameState.PLAYING) {
      setGameState(GameState.PAUSED);
    } else if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  };

  // Handle square click
  const handleSquareClick = (square: string) => {
    // Only allow moves when game is in playing state
    if (gameState !== GameState.PLAYING) {
      return;
    }
    
    // In single player mode, only allow player to move their pieces
    if (gameMode === GameMode.SINGLE_PLAYER) {
      const piece = game.get(square);
      if (selectedSquare === null && piece && piece.color === aiColor) {
        return; // Prevent selecting AI's pieces
      }
    }
    
    // If a square is already selected
    if (selectedSquare) {
      // Check if this is a promotion move
      if (isPromotion(selectedSquare, square)) {
        // Store pending move and show modal
        setPendingMove({ from: selectedSquare, to: square });
        setShowPromotionModal(true);
        return;
      }

      // Make regular move
      const moveResult = makeMove(selectedSquare, square) as MoveResult | boolean;
      
      // If move was successful
      if (moveResult && typeof moveResult !== 'boolean') {
        // Play appropriate sound
        if (moveResult.captured) {
          playCaptureSound();
          
          // Update captured pieces
          const piece = moveResult.captured;
          const color = turn === 'w' ? 'white' : 'black';
          setCapturedPieces(prev => ({
            ...prev,
            [color]: [...prev[color], piece]
          }));
        } else if (moveResult.flags && (moveResult.flags.includes('k') || moveResult.flags.includes('q'))) {
          playCastleSound();
        } else {
          playMoveSound();
        }
        
        // Update last move
        setLastMove({ from: selectedSquare, to: square });
        
        // Update move count
        setMoveCount(prev => prev + 1);
        
        // Check for check/checkmate/draw
        if (game.isCheckmate()) {
          playCheckmateSound();
          setGameState(GameState.ENDED);
        } else if (game.isDraw()) {
          playDrawSound();
          setGameState(GameState.ENDED);
        } else if (game.isCheck()) {
          playCheckSound();
        }
      } else if (moveResult === true) {
        // Simple move without additional info
        playMoveSound();
        setLastMove({ from: selectedSquare, to: square });
        setMoveCount(prev => prev + 1);
      }
      
      // Reset selection and possible moves
      setSelectedSquare(null);
      setPossibleMoves([]);
      
      return;
    }
    
    // Otherwise, select the square if it has a piece of the current player
    const piece = game.get(square);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      
      // Calculate possible moves for this piece
      const moves = game.moves({ square, verbose: true }) as Move[];
      setPossibleMoves(moves.map(move => move.to));
    }
  };

  // Handle promotion selection
  const handlePromotionSelect = (pieceType: string) => {
    if (pendingMove) {
      const moveResult = makeMove(pendingMove.from, pendingMove.to, pieceType) as MoveResult | boolean;
      
      if (moveResult) {
        playPromotionSound();
        setLastMove({ from: pendingMove.from, to: pendingMove.to });
        setMoveCount(prev => prev + 1);
      }
      
      // Close modal and reset states
      setShowPromotionModal(false);
      setPendingMove(null);
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    const winner = turn === 'w' ? 'Black' : 'White';
    alert(`Time's up! ${winner} wins!`);
    setGameState(GameState.ENDED);
  };

  // New game
  const handleNewGame = () => {
    reset();
    setGameState(GameState.SETUP);
    // Reset timers to initial values when creating a new game
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    setMoveCount(0);
    setCapturedPieces({ white: [], black: [] });
    setLastMove(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  // Render chess board
  const renderBoard = () => {
    const board = [];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const square = `${files[f]}${ranks[r]}`;
        const piece = currentPosition[square];
        const isLight = (r + f) % 2 === 0;
        const isSelected = square === selectedSquare;
        const isPossibleMove = possibleMoves.includes(square);
        const isLastMoveSquare = lastMove ? (square === lastMove.from || square === lastMove.to) : false;
        
        const squareThemeStyles = getSquareStyles(isLight, isSelected, isPossibleMove, isLastMoveSquare);
        
        board.push(
          <Square 
            key={square}
            square={square}
            isLight={isLight}
            isSelected={isSelected}
            isPossibleMove={isPossibleMove}
            isLastMove={isLastMoveSquare}
            themeStyles={squareThemeStyles}
            onClick={() => handleSquareClick(square)}
          >
            {piece && (
              <ChessPieceImage piece={piece} />
            )}
          </Square>
        );
      }
    }
    
    return board;
  };

  // Toggle settings modal
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Toggle rules modal
  const toggleRules = () => {
    setShowRules(!showRules);
  };

  // Get game status text
  const getGameStatusText = () => {
    if (gameState === GameState.SETUP) {
      return "Press 'Start Game' to begin";
    } else if (gameState === GameState.PAUSED) {
      return "Game Paused";
    } else if (gameState === GameState.ENDED) {
      return game.isCheckmate() ? 'Checkmate!' : 
             game.isDraw() ? 'Draw!' : 'Game Ended';
    } else {
      return game.isCheck() ? 'Check!' : 
             isThinking ? 'AI thinking...' :
             `${turn === 'w' ? 'White' : 'Black'} to move`;
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.gameContainer}>
          <div className={styles.timerContainer}>
            <Timer 
              isActive={isBlackTimerActive} 
              initialTime={blackTime} 
              onTimeUp={handleTimeUp} 
              onTimeChange={(time) => setBlackTime(time)}
              color="black" 
            />
          </div>
          
          <div className={styles.boardContainer}>
            <div className={styles.board} style={getBoardStyle()}>
              {renderBoard()}
            </div>
          </div>
          
          <div className={styles.timerContainer}>
            <Timer 
              isActive={isWhiteTimerActive} 
              initialTime={whiteTime} 
              onTimeUp={handleTimeUp} 
              onTimeChange={(time) => setWhiteTime(time)}
              color="white" 
            />
          </div>
        </div>
        
        <div className={styles.sidePanel}>
          <div className={styles.controls}>
            <button className={styles.controlButton} onClick={handleNewGame}>New Game</button>
            {gameState === GameState.SETUP ? (
              <>
                <button className={styles.controlButton} onClick={handleStartGame}>Start Game</button>
                <button className={styles.controlButton} onClick={toggleGameMode}>
                  {gameMode === GameMode.SINGLE_PLAYER ? 'Switch to 2 Players' : 'Switch to 1 Player'}
                </button>
              </>
            ) : (
              <button className={styles.controlButton} onClick={handlePauseGame}>
                {gameState === GameState.PAUSED ? 'Resume' : 'Pause'}
              </button>
            )}
            <button className={styles.controlButton} onClick={undo}>Undo</button>
          </div>
          
          <div className={styles.extraControls}>
            <button className={styles.settingsButton} onClick={toggleSettings}>Settings</button>
            <button className={styles.rulesButton} onClick={toggleRules}>Chess Rules</button>
          </div>
          
          <div className={styles.gameStatus}>
            <div>
              {getGameStatusText()}
            </div>
            <div className={styles.gameModeDisplay}>
              Mode: {gameMode === GameMode.SINGLE_PLAYER ? 'Single Player' : 'Two Players'}
              {gameMode === GameMode.SINGLE_PLAYER && (
                <span> (You: {aiColor === 'b' ? 'White' : 'Black'})</span>
              )}
            </div>
          </div>
          
          <GameStats 
            game={game} 
            whiteTime={whiteTime} 
            blackTime={blackTime} 
            moveCount={moveCount}
            capturedPieces={capturedPieces}
          />
          
          <MoveHint 
            game={game} 
            onSelectMove={(from, to) => {
              if (gameState === GameState.PLAYING) {
                handleSquareClick(from);
                handleSquareClick(to);
              }
            }} 
          />
          
          <GameHistory history={history} />
        </div>
      </div>

      {showPromotionModal && (
        <PromotionModal 
          isOpen={showPromotionModal}
          color={turn}
          onSelect={handlePromotionSelect}
        />
      )}
      
      {showSettings && (
        <GameSettings 
          initialTime={initialTime}
          setInitialTime={setInitialTime}
          aiLevel={aiLevel}
          setAILevel={setAILevel}
          aiColor={aiColor}
          setAIColor={setAIColor}
          boardTheme={boardTheme}
          setBoardTheme={setBoardTheme}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onClose={toggleSettings}
          gameMode={gameMode}
        />
      )}
      
      {showRules && (
        <ChessRules onClose={toggleRules} />
      )}
    </>
  );
};

export default ChessBoard; 