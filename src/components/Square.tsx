import React from 'react';
import styles from '@/styles/Square.module.css';

interface SquareProps {
  square: string;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isLastMove?: boolean;
  themeStyles?: React.CSSProperties;
  onClick: () => void;
  children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({ 
  square, 
  isLight, 
  isSelected, 
  isPossibleMove,
  isLastMove = false,
  themeStyles,
  onClick, 
  children 
}) => {
  // Determine the CSS classes for styling
  const squareClasses = [
    styles.square,
    isLight ? styles.light : styles.dark,
    isSelected ? styles.selected : '',
    isPossibleMove ? styles.possibleMove : '',
    isLastMove ? styles.lastMove : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={squareClasses} 
      onClick={onClick} 
      data-square={square}
      style={themeStyles}
    >
      {children}
    </div>
  );
};

export default Square; 