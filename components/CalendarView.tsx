
import React from 'react';

const CalendarView: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-white text-2xl font-romantic mb-6 text-center">Nuestros Días 27 - {currentYear}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {months.map((month, idx) => {
          const isFebruary = idx === 1;
          const isPast = new Date() > new Date(currentYear, idx, 27);
          
          return (
            <div 
              key={month} 
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                isPast 
                  ? 'bg-red-500/20 border-red-400/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-[10px] text-white/60 uppercase font-bold">{month.substring(0, 3)}</span>
              <div className="relative mt-1">
                <span className="text-xl font-bold text-white">27</span>
                {isFebruary && <div className="absolute -top-1 -right-2 text-[8px] text-pink-300">💖</div>}
              </div>
              {isPast ? (
                <span className="text-[8px] text-red-200 mt-1">Celebrado</span>
              ) : (
                <span className="text-[8px] text-green-200 mt-1">Pendiente</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
