import { useEffect, useRef } from 'react';

interface UseChessSoundOptions {
  enabled: boolean;
}

const useChessSound = ({ enabled }: UseChessSoundOptions) => {
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const checkSound = useRef<HTMLAudioElement | null>(null);
  const checkmateSound = useRef<HTMLAudioElement | null>(null);
  const castleSound = useRef<HTMLAudioElement | null>(null);
  const drawSound = useRef<HTMLAudioElement | null>(null);
  const promotionSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio elements
    moveSound.current = new Audio('/sounds/move.mp3');
    captureSound.current = new Audio('/sounds/capture.mp3');
    checkSound.current = new Audio('/sounds/check.mp3');
    checkmateSound.current = new Audio('/sounds/checkmate.mp3');
    castleSound.current = new Audio('/sounds/castle.mp3');
    drawSound.current = new Audio('/sounds/draw.mp3');
    promotionSound.current = new Audio('/sounds/promotion.mp3');
    
    // Preload audio
    const preloadAudio = (audio: HTMLAudioElement) => {
      audio.load();
    };
    
    if (moveSound.current) preloadAudio(moveSound.current);
    if (captureSound.current) preloadAudio(captureSound.current);
    if (checkSound.current) preloadAudio(checkSound.current);
    if (checkmateSound.current) preloadAudio(checkmateSound.current);
    if (castleSound.current) preloadAudio(castleSound.current);
    if (drawSound.current) preloadAudio(drawSound.current);
    if (promotionSound.current) preloadAudio(promotionSound.current);
    
    // Cleanup
    return () => {
      moveSound.current = null;
      captureSound.current = null;
      checkSound.current = null;
      checkmateSound.current = null;
      castleSound.current = null;
      drawSound.current = null;
      promotionSound.current = null;
    };
  }, []);
  
  const playSound = (sound: HTMLAudioElement | null) => {
    if (enabled && sound) {
      // Reset audio to beginning if already playing
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };
  
  return {
    playMoveSound: () => playSound(moveSound.current),
    playCaptureSound: () => playSound(captureSound.current),
    playCheckSound: () => playSound(checkSound.current),
    playCheckmateSound: () => playSound(checkmateSound.current),
    playCastleSound: () => playSound(castleSound.current),
    playDrawSound: () => playSound(drawSound.current),
    playPromotionSound: () => playSound(promotionSound.current)
  };
};

export default useChessSound; 