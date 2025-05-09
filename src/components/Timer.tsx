import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Timer.module.css';

interface TimerProps {
  isActive: boolean; // Xác định xem timer có đang chạy không
  initialTime: number; // Thời gian ban đầu tính bằng giây
  onTimeUp: () => void; // Callback khi hết giờ
  onTimeChange?: (time: number) => void; // Callback khi thời gian thay đổi
  color: 'white' | 'black'; // Màu của người chơi
}

const Timer: React.FC<TimerProps> = ({ 
  isActive, 
  initialTime, 
  onTimeUp, 
  onTimeChange = () => {}, 
  color 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  // Sử dụng tham chiếu để theo dõi interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Đảm bảo khi component unmount hoặc isActive thay đổi, interval được clear
  useEffect(() => {
    // Khi component mount hoặc initialTime thay đổi, reset thời gian
    setTimeLeft(initialTime);
    
    // Nếu đồng hồ hoạt động và còn thời gian, bắt đầu đếm ngược
    if (isActive && timeLeft > 0) {
      // Clear interval cũ nếu có
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Tạo interval mới để giảm thời gian
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Nếu đã hết thời gian, dừng interval và thông báo
          if (prevTime <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      // Nếu đồng hồ không hoạt động và có interval, clear nó
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Cleanup khi component unmount hoặc dependencies thay đổi
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, initialTime, onTimeUp]);
  
  // Cập nhật thời gian lên component cha mỗi khi thời gian thay đổi
  useEffect(() => {
    onTimeChange(timeLeft);
  }, [timeLeft, onTimeChange]);
  
  // Chuyển đổi giây thành định dạng MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`${styles.timer} ${styles[color]} ${isActive ? styles.active : ''}`}>
      <div className={styles.timeDisplay}>{formatTime(timeLeft)}</div>
    </div>
  );
};

export default Timer; 