
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Calendar, Settings, Bell, Star, Image as ImageIcon, Download, Trash2, Plus, Camera, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Tipos ---
interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
}

// --- Componentes Internos (Para asegurar la carga) ---

const LogoNaranja = ({ className = "w-12 h-12" }) => (
  <div className={`relative ${className} flex items-center justify-center`}>
    <img src="https://img.icons8.com/emoji/512/orange-heart.png" className="w-full h-full drop-shadow-lg" alt="Logo" />
  </div>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const calculate = useCallback(() => {
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), 27);
    if (now > target) target = new Date(now.getFullYear(), now.getMonth() + 1, 27);
    const diff = target.getTime() - now.getTime();
    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    });
  }, []);
  useEffect(() => {
    calculate();
    const t = setInterval(calculate, 1000);
    return () => clearInterval(t);
  }, [calculate]);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Próximo día 27 en:</p>
      <div className="flex gap-2">
        {Object.entries(timeLeft).map(([label, val]) => (
          <div key={label} className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 w-16 text-center">
            <div className="text-xl font-bold text-white">{val}</div>
            <div className="text-[8px] text-white/50 uppercase">{label.charAt(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalendarView = () => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const today = new Date();
  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 w-full">
      <h3 className="text-white text-xl font-romantic mb-4 text-center">Nuestro Calendario</h3>
      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => {
          const isFeb = i === 1;
          const isPassed = today > new Date(today.getFullYear(), i, 27);
          return (
            <div key={m} className={`p-2 rounded-lg border flex flex-col items-center ${isPassed ? 'bg-orange-500/20 border-orange-400/30' : 'bg-white/5 border-white/10'}`}>
              <span className="text-[10px] text-white/40 uppercase">{m}</span>
              <span className="text-lg font-bold text-white">27</span>
              {isFeb && <span className="text-[10px]">🧡</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- App Principal ---

const App: React.FC = () => {
  const [background, setBackground] = useState(() => localStorage.getItem('love_bg') || 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)');
  const [memories, setMemories] = useState<Memory[]>(() => JSON.parse(localStorage.getItem('love_memories') || '[]'));
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'memories'>('home');
  const [message, setMessage] = useState("Cargando mensaje...");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if ((window as any).hideAppLoader) (window as any).hideAppLoader();
    checkMessage();
  }, []);

  const checkMessage = async () => {
    const today = new Date();
    const is27 = today.getDate() === 27;
    const isFeb = today.getMonth() === 1;
    if (isFeb && is27) {
      setMessage("Feliz aniversario mi amor y que sean muchos más");
    } else {
      setMessage(is27 ? "¡Hoy es nuestro día especial! ❤️" : "Cada día te quiero más.");
    }
  };

  const handleInstall = () => {
    alert("Para tener el corazón naranja en tu menú:\n1. Pulsa el botón 'Compartir' de tu navegador.\n2. Elige 'Añadir a pantalla de inicio'.");
  };

  return (
    <div style={{ background, minHeight: '100vh', transition: '0.5s' }} className="flex flex-col items-center p-6 pb-24 overflow-x-hidden relative">
      
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-10 z-10">
        <div className="flex items-center gap-3">
          <LogoNaranja className="w-10 h-10" />
          <h1 className="text-white text-lg font-romantic">Nuestra Historia</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleInstall} className="p-2 bg-white/10 rounded-full text-orange-400"><Download size={20}/></button>
          <button onClick={() => setShowSettings(true)} className="p-2 bg-white/10 rounded-full text-white"><Settings size={20}/></button>
        </div>
      </header>

      {/* Main */}
      <main className="w-full max-w-sm flex flex-col items-center flex-grow z-10">
        {activeTab === 'home' && (
          <div className="flex flex-col items-center gap-10 animate-fadeIn text-center">
            <h2 className="text-white text-4xl font-romantic px-4">
              {new Date().getDate() === 27 ? "¡Feliz 27!" : "Nuestro Amor"}
            </h2>
            <LogoNaranja className="w-24 h-24 animate-pulse" />
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl italic text-white/90">
              "{message}"
            </div>
            <Countdown />
          </div>
        )}

        {activeTab === 'calendar' && <div className="w-full animate-fadeIn"><CalendarView /></div>}
        
        {activeTab === 'memories' && (
          <div className="w-full animate-fadeIn flex flex-col gap-4">
            <h3 className="text-white text-xl font-romantic text-center">Álbum de Fotos</h3>
            <div className="grid grid-cols-2 gap-3">
              {memories.length === 0 ? <p className="col-span-2 text-white/40 text-center py-10">No hay fotos aún</p> : 
                memories.map(m => (
                  <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/20">
                    <img src={m.imageUrl} className="w-full h-full object-cover" />
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-white/95 w-full rounded-t-[40px] p-8 flex flex-col gap-6">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" onClick={() => setShowSettings(false)} />
            <h4 className="text-pink-600 font-bold text-center">Personalizar Fondo</h4>
            <div className="flex gap-3 overflow-x-auto py-2">
              {['linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', '#1a1a1a', '#ff9a9e', '#fbc2eb'].map(color => (
                <button 
                  key={color} 
                  onClick={() => { setBackground(color); localStorage.setItem('love_bg', color); }}
                  className="w-12 h-12 rounded-lg border-2 border-white flex-shrink-0"
                  style={{ background: color }}
                />
              ))}
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold">Cerrar</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 h-16 rounded-2xl flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('home')} className={`p-2 ${activeTab === 'home' ? 'text-orange-400' : 'text-white/60'}`}><Heart fill={activeTab === 'home' ? "currentColor" : "none"} /></button>
        <button onClick={() => setActiveTab('calendar')} className={`p-2 ${activeTab === 'calendar' ? 'text-white' : 'text-white/60'}`}><Calendar /></button>
        <button onClick={() => setActiveTab('memories')} className={`p-2 ${activeTab === 'memories' ? 'text-white' : 'text-white/60'}`}><ImageIcon /></button>
      </nav>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
