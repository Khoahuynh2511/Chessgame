declare module 'chess.js' {
  export interface Square {
    name: string;
    file: number;
    rank: number;
  }

  export interface Move {
    color: string;
    from: string;
    to: string;
    flags: string;
    piece: string;
    san: string;
    promotion?: string;
  }
  
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
    move(move: string | { from: string; to: string; promotion?: string }): Move | null;
    moves(options?: { square?: string; verbose?: boolean }): string[] | Move[];
    pgn(): string;
    put(piece: { type: string; color: string }, square: string): boolean;
    remove(square: string): { type: string; color: string } | null;
    reset(): void;
    square_color(square: string): string;
    turn(): 'w' | 'b';
    undo(): Move | null;
    validate_fen(fen: string): { valid: boolean; error_number: number; error: string };
  }
} 