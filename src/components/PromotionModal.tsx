import React from 'react';
import styles from '@/styles/PromotionModal.module.css';

interface PromotionModalProps {
  isOpen: boolean;
  color: 'w' | 'b';
  onSelect: (pieceType: string) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, color, onSelect }) => {
  if (!isOpen) return null;

  // Các quân cờ có thể chọn để phong cấp
  const pieces = [
    { type: 'q', symbol: color === 'w' ? '♕' : '♛', name: 'Hậu' },
    { type: 'r', symbol: color === 'w' ? '♖' : '♜', name: 'Xe' },
    { type: 'n', symbol: color === 'w' ? '♘' : '♞', name: 'Mã' },
    { type: 'b', symbol: color === 'w' ? '♗' : '♝', name: 'Tượng' }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Chọn quân cờ để phong cấp</h3>
        <div className={styles.pieceContainer}>
          {pieces.map(piece => (
            <div 
              key={piece.type} 
              className={styles.pieceOption}
              onClick={() => onSelect(piece.type)}
            >
              <span className={styles.pieceSymbol}>{piece.symbol}</span>
              <span className={styles.pieceName}>{piece.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal; 