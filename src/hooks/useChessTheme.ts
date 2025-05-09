import { useMemo } from 'react';

type ThemeColors = {
  lightSquare: string;
  darkSquare: string;
  selectedSquare: string;
  possibleMove: string;
  lastMove: string;
};

const useChessTheme = (theme: string = 'classic') => {
  const themeColors = useMemo<ThemeColors>(() => {
    switch (theme) {
      case 'wooden':
        return {
          lightSquare: '#e9c496',
          darkSquare: '#8b5a2b',
          selectedSquare: 'rgba(255, 255, 0, 0.5)',
          possibleMove: 'rgba(0, 128, 0, 0.4)',
          lastMove: 'rgba(173, 216, 230, 0.5)'
        };
      case 'blue':
        return {
          lightSquare: '#cad9e8',
          darkSquare: '#6082b6',
          selectedSquare: 'rgba(255, 255, 0, 0.5)',
          possibleMove: 'rgba(0, 128, 0, 0.4)',
          lastMove: 'rgba(255, 182, 193, 0.5)'
        };
      case 'classic':
      default:
        return {
          lightSquare: '#f0d9b5',
          darkSquare: '#b58863',
          selectedSquare: 'rgba(255, 255, 0, 0.5)',
          possibleMove: 'rgba(0, 128, 0, 0.4)',
          lastMove: 'rgba(155, 199, 0, 0.4)'
        };
    }
  }, [theme]);

  const getSquareStyles = (isLight: boolean, isSelected: boolean, isPossibleMove: boolean, isLastMove: boolean) => {
    const styles: React.CSSProperties = {
      backgroundColor: isLight ? themeColors.lightSquare : themeColors.darkSquare
    };

    if (isSelected) {
      styles.backgroundColor = themeColors.selectedSquare;
      styles.boxShadow = 'inset 0 0 0 3px rgba(0, 0, 0, 0.5)';
    } else if (isPossibleMove) {
      styles.boxShadow = `inset 0 0 0 4px ${themeColors.possibleMove}`;
    } else if (isLastMove) {
      styles.boxShadow = `inset 0 0 0 4px ${themeColors.lastMove}`;
    }

    return styles;
  };

  const getBoardStyle = (): React.CSSProperties => {
    return {
      border: `2px solid ${themeColors.darkSquare}`,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
    };
  };

  return {
    themeColors,
    getSquareStyles,
    getBoardStyle
  };
};

export default useChessTheme; 