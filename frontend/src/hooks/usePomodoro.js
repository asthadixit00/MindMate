import { useState, useEffect, useRef, useCallback } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export function usePomodoro() {
  const [phase, setPhase] = useState('work'); // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setPhase((p) => {
          if (p === 'work') {
            setCycles((c) => c + 1);
            setTimeLeft(BREAK_MINUTES * 60);
            return 'break';
          } else {
            setTimeLeft(WORK_MINUTES * 60);
            return 'work';
          }
        });
        return 0;
      }
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setPhase('work');
    setTimeLeft(WORK_MINUTES * 60);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const progress = phase === 'work'
    ? 1 - timeLeft / (WORK_MINUTES * 60)
    : 1 - timeLeft / (BREAK_MINUTES * 60);

  return { phase, minutes, seconds, isRunning, cycles, progress, start, pause, reset };
}
