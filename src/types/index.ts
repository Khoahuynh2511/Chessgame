// Chess types
export interface PieceType {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
}

// Module declarations for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declare chess.js module
declare module 'chess.js' {
  export class Chess {
    constructor(fen?: string);
    
    board(): Array<Array<{ type: string; color: string } | null>>;
    clear(): void;
    fen(): string;
    game_over(): boolean;
    get(square: string): { type: string; color: string } | null;
    history(): string[];
    in_check(): boolean;
    in_checkmate(): boolean;
    in_draw(): boolean;
    in_stalemate(): boolean;
    in_threefold_repetition(): boolean;
    isCheck(): boolean;
    isCheckmate(): boolean;
    isDraw(): boolean;
    isStalemate(): boolean;
    isThreefoldRepetition(): boolean;
    load(fen: string): boolean;
    move(move: string | { from: string; to: string; promotion?: string }): { color: string; flags: string; piece: string; san: string; from: string; to: string } | null;
    moves(options?: { square?: string; verbose?: boolean }): string[] | Array<{ color: string; from: string; to: string; flags: string; piece: string; san: string }>;
    pgn(): string;
    put(piece: { type: string; color: string }, square: string): boolean;
    remove(square: string): { type: string; color: string } | null;
    reset(): void;
    square_color(square: string): string;
    turn(): 'w' | 'b';
    undo(): { color: string; flags: string; piece: string; san: string; from: string; to: string } | null;
    validate_fen(fen: string): { valid: boolean; error_number: number; error: string };
  }
}

// Declare react-chess-pieces module
declare module 'react-chess-pieces' {
  import { FC } from 'react';
  
  export interface PieceProps {
    piece: string;
    size?: number;
    style?: React.CSSProperties;
    className?: string;
  }
  
  export const Piece: FC<PieceProps>;
} 