
import React from 'react';

interface Props {
  onSelect: (type: 'color' | 'gradient' | 'image', value: string) => void;
}

const BackgroundPicker: React.FC<Props> = ({ onSelect }) => {
  const options = [
    { type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Sunset' },
    { type: 'gradient', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', label: 'Purple' },
    { type: 'gradient', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', label: 'Pinky' },
    { type: 'color', value: '#1a1a1a', label: 'Night' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1000', label: 'Love' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1516589174184-c68526514b4c?auto=format&fit=crop&q=80&w=1000', label: 'Holding' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <span className="text-white/60 text-xs uppercase font-bold tracking-widest px-1">Personalizar Fondo</span>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt.type as any, opt.value)}
            className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-white/20 overflow-hidden hover:scale-105 active:scale-95 transition-all"
            style={{ 
              background: opt.type === 'image' ? `url(${opt.value}) center/cover` : opt.value 
            }}
          >
            <span className="sr-only">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundPicker;
