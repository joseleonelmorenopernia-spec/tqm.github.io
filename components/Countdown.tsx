
import React, { useState, useEffect, useCallback } from 'react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), 27);

    // If today is past the 27th, target the 27th of the next month
    if (now > target) {
      target = new Date(now.getFullYear(), now.getMonth() + 1, 27);
    }

    const difference = target.getTime() - now.getTime();
    
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, []);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/20 backdrop-blur-md rounded-2xl p-4 w-20 shadow-lg border border-white/30 transition-transform hover:scale-105">
      <span className="text-3xl font-bold text-white drop-shadow-md">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/80 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <h2 className="text-white text-lg font-medium opacity-90 tracking-wide uppercase text-center">Próximo 27 en:</h2>
      <div className="flex gap-3 justify-center">
        <TimeBlock value={timeLeft.days} label="Días" />
        <TimeBlock value={timeLeft.hours} label="Hrs" />
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <TimeBlock value={timeLeft.seconds} label="Seg" />
      </div>
    </div>
  );
};

export default Countdown;
