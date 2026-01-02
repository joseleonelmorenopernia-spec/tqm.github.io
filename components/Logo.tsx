
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-xl"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M50 88C50 88 15 65 15 38C15 22 28 12 42 12C46 12 50 14 50 14C50 14 54 12 58 12C72 12 85 22 85 38C85 65 50 88 50 88Z" 
          className="fill-white/20 stroke-white" 
          strokeWidth="2"
        />
        <path 
          d="M50 75C50 75 25 58 25 38C25 28 32 20 41 20C44 20 47 21 50 23C53 21 56 20 59 20C68 20 75 28 75 38C75 58 50 75 50 75Z" 
          className="fill-red-400/80 animate-pulse"
        />
        <text 
          x="50" 
          y="45" 
          textAnchor="middle" 
          className="fill-white font-bold" 
          style={{ fontSize: '10px', fontFamily: 'Dancing Script, cursive' }}
        >
          Love
        </text>
      </svg>
    </div>
  );
};

export default Logo;
