import React, { useState } from 'react';
import styles from '@/styles/GameSettings.module.css';
import { AILevel } from '@/hooks/useChessAI';

enum GameMode {
  SINGLE_PLAYER,
  TWO_PLAYERS
}

interface GameSettingsProps {
  initialTime: number;
  setInitialTime: (time: number) => void;
  aiLevel: AILevel;
  setAILevel: (level: AILevel) => void;
  aiColor: 'w' | 'b';
  setAIColor: (color: 'w' | 'b') => void;
  boardTheme: string;
  setBoardTheme: (theme: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onClose: () => void;
  gameMode: GameMode;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  initialTime,
  setInitialTime,
  aiLevel,
  setAILevel,
  aiColor,
  setAIColor,
  boardTheme,
  setBoardTheme,
  soundEnabled,
  setSoundEnabled,
  onClose,
  gameMode
}) => {
  const [localTime, setLocalTime] = useState(initialTime);
  const [localAILevel, setLocalAILevel] = useState(aiLevel);
  const [localAIColor, setLocalAIColor] = useState(aiColor);
  const [localBoardTheme, setLocalBoardTheme] = useState(boardTheme);
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);

  const handleSave = () => {
    setInitialTime(localTime);
    setAILevel(localAILevel);
    setAIColor(localAIColor);
    setBoardTheme(localBoardTheme);
    setSoundEnabled(localSoundEnabled);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Game Settings</h2>
        
        <div className={styles.settingGroup}>
          <h3>Time Control</h3>
          <div className={styles.settingControls}>
            <button 
              className={localTime === 300 ? styles.selected : ''} 
              onClick={() => setLocalTime(300)}
            >
              5 Minutes
            </button>
            <button 
              className={localTime === 600 ? styles.selected : ''} 
              onClick={() => setLocalTime(600)}
            >
              10 Minutes
            </button>
            <button 
              className={localTime === 900 ? styles.selected : ''} 
              onClick={() => setLocalTime(900)}
            >
              15 Minutes
            </button>
          </div>
        </div>
        
        {gameMode === GameMode.SINGLE_PLAYER && (
          <>
            <div className={styles.settingGroup}>
              <h3>AI Difficulty</h3>
              <div className={styles.settingControls}>
                <button 
                  className={localAILevel === AILevel.Easy ? styles.selected : ''} 
                  onClick={() => setLocalAILevel(AILevel.Easy)}
                >
                  Easy
                </button>
                <button 
                  className={localAILevel === AILevel.Medium ? styles.selected : ''} 
                  onClick={() => setLocalAILevel(AILevel.Medium)}
                >
                  Medium
                </button>
                <button 
                  className={localAILevel === AILevel.Hard ? styles.selected : ''} 
                  onClick={() => setLocalAILevel(AILevel.Hard)}
                >
                  Hard
                </button>
              </div>
            </div>
            
            <div className={styles.settingGroup}>
              <h3>AI Plays as</h3>
              <div className={styles.settingControls}>
                <button 
                  className={localAIColor === 'b' ? styles.selected : ''} 
                  onClick={() => setLocalAIColor('b')}
                >
                  Black
                </button>
                <button 
                  className={localAIColor === 'w' ? styles.selected : ''} 
                  onClick={() => setLocalAIColor('w')}
                >
                  White
                </button>
              </div>
            </div>
          </>
        )}
        
        <div className={styles.settingGroup}>
          <h3>Board Theme</h3>
          <div className={styles.themeSelector}>
            <div 
              className={`${styles.themeOption} ${styles.classic} ${localBoardTheme === 'classic' ? styles.selectedTheme : ''}`}
              onClick={() => setLocalBoardTheme('classic')}
            ></div>
            <div 
              className={`${styles.themeOption} ${styles.wooden} ${localBoardTheme === 'wooden' ? styles.selectedTheme : ''}`}
              onClick={() => setLocalBoardTheme('wooden')}
            ></div>
            <div 
              className={`${styles.themeOption} ${styles.blue} ${localBoardTheme === 'blue' ? styles.selectedTheme : ''}`}
              onClick={() => setLocalBoardTheme('blue')}
            ></div>
          </div>
        </div>
        
        <div className={styles.settingGroup}>
          <div className={styles.toggleRow}>
            <h3>Sound Effects</h3>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={localSoundEnabled}
                onChange={() => setLocalSoundEnabled(!localSoundEnabled)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.saveButton} onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default GameSettings;

 