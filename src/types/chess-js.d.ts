declare module 'chess.js' {
  export interface Square {
    name: string;
    file: number;
    rank: number;
  }

  export interface Move {
    from: string;
    to: string;
    promotion?: string;
    piece: string;
    color: 'w' | 'b';
    flags: string;
    san: string;
  }
  
  export class Chess {
    constructor(fen?: string);
    
    board(): Array<Array<{ type: string; color: string } | null>>;
    clear(): void;
    fen(): string;
    get(square: string): { type: string; color: string } | null;
    history(): string[];
    in_check(): boolean;
    in_checkmate(): boolean;
    in_draw(): boolean;
    in_stalemate(): boolean;
    in_threefold_repetition(): boolean;
    insufficient_material(): boolean;
    isCheck(): boolean;
    isCheckmate(): boolean;
    isDraw(): boolean;
    isStalemate(): boolean;
    isInsufficientMaterial(): boolean;
    isThreefoldRepetition(): boolean;
    load(fen: string): boolean;
    move(move: string | { from: string; to: string; promotion?: string }): any;
    moves(options?: { square?: string; verbose?: boolean }): any;
    pgn(): string;
    put(piece: { type: string; color: string }, square: string): boolean;
    remove(square: string): boolean;
    reset(): void;
    square_color(square: string): string;
    turn(): 'w' | 'b';
    undo(): any;
    validate_fen(fen: string): { valid: boolean; error_number: number; error: string };
  }
} 