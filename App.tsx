
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Calendar, Settings, Bell, Star, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import Countdown from './components/Countdown';
import CalendarView from './components/CalendarView';
import BackgroundPicker from './components/BackgroundPicker';
import MemoryGallery from './components/MemoryGallery';
import Logo from './components/Logo';
import { generateRomanticMessage } from './services/geminiService';
import { AnniversaryState, Memory } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnniversaryState>(() => {
    const saved = localStorage.getItem('love_app_state');
    return saved ? JSON.parse(saved) : {
      background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
      backgroundType: 'gradient',
      partnerName: 'Mi Amor'
    };
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('love_memories');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'memories'>('home');
  const [message, setMessage] = useState<string>("Cargando...");
  const [showSettings, setShowSettings] = useState(false);
  const [isAnniversaryDay, setIsAnniversaryDay] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Ocultar pantalla de carga al montar
  useEffect(() => {
    if (typeof (window as any).hideAppLoader === 'function') {
      (window as any).hideAppLoader();
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("Para descargar en tu iPhone/Android:\n\n1. Pulsa el botón 'Compartir' de tu navegador.\n2. Selecciona 'Añadir a la pantalla de inicio'.\n\n¡Así verás el corazón naranja en tu menú! ❤️");
    }
  };

  const checkAnniversary = useCallback(async () => {
    const today = new Date();
    const is27 = today.getDate() === 27;
    const isFeb = today.getMonth() === 1;
    
    setIsAnniversaryDay(is27);
    
    // Si es febrero y es 27, forzar el mensaje pedido por el usuario
    if (isFeb && is27) {
      setMessage("Feliz aniversario mi amor y que sean muchos más");
    } else {
      const msg = await generateRomanticMessage(isFeb && is27);
      setMessage(msg);
    }

    if (is27 && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("¡Es nuestro día!", {
          body: isFeb && is27 ? "Feliz aniversario mi amor y que sean muchos más" : "Hoy es nuestro día especial.",
          icon: "https://img.icons8.com/emoji/512/orange-heart.png"
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    checkAnniversary();
    localStorage.setItem('love_app_state', JSON.stringify(state));
  }, [state, checkAnniversary]);

  useEffect(() => {
    localStorage.setItem('love_memories', JSON.stringify(memories));
  }, [memories]);

  const updateBackground = (type: 'color' | 'gradient' | 'image', value: string) => {
    setState(prev => ({ ...prev, backgroundType: type, background: value }));
  };

  const addMemory = (memory: Memory) => setMemories(prev => [memory, ...prev]);
  const deleteMemory = (id: string) => setMemories(prev => prev.filter(m => m.id !== id));

  const mainStyle = {
    background: state.backgroundType === 'image' ? `url(${state.background}) center/cover no-repeat fixed` : state.background,
    minHeight: '100vh',
    transition: 'all 0.5s ease-in-out'
  };

  return (
    <div style={mainStyle} className="relative flex flex-col items-center px-6 pt-10 pb-32 overflow-x-hidden select-none">
      {state.backgroundType === 'image' && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />}

      <header className="relative z-10 w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Logo className="w-12 h-12" />
          <div>
            <h1 className="text-white text-xl font-romantic tracking-wide leading-tight">Nuestra Historia</h1>
            <p className="text-white/60 text-[8px] uppercase tracking-widest font-bold">Desde siempre</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleInstallClick}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5 text-orange-400" />
            {deferredPrompt && <span className="text-[10px] font-bold pr-1">INSTALAR</span>}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-lg flex flex-col items-center flex-grow">
        {activeTab === 'home' && (
          <div className="w-full flex flex-col items-center gap-12 animate-fadeIn">
            <section className="text-center space-y-4 w-full">
              <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-2">
                <span className="text-white text-[10px] uppercase font-bold tracking-widest">Contigo todo es mejor</span>
              </div>
              <h2 className="text-white text-5xl font-romantic leading-tight drop-shadow-lg px-4">
                {isAnniversaryDay ? "¡Nuestro Día!" : "Te amo cada día más"}
              </h2>
              
              <div className="flex justify-center my-4 opacity-90 drop-shadow-2xl">
                <img src="https://img.icons8.com/emoji/512/orange-heart.png" className="w-24 h-24 animate-pulse" alt="Logo" />
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 shadow-xl max-w-sm mx-auto">
                <p className="text-white/90 italic text-lg font-light leading-relaxed">
                  "{message}"
                </p>
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-orange-300 fill-orange-300 opacity-60" />
                  ))}
                </div>
              </div>
            </section>
            <Countdown />
          </div>
        )}

        {activeTab === 'calendar' && <section className="w-full animate-fadeIn"><CalendarView /></section>}
        {activeTab === 'memories' && (
          <section className="w-full animate-fadeIn">
            <MemoryGallery memories={memories} onAdd={addMemory} onDelete={deleteMemory} />
          </section>
        )}
      </main>

      <div className={`fixed inset-x-0 bottom-0 z-[60] transition-transform duration-500 transform ${showSettings ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white/10 backdrop-blur-2xl rounded-t-[40px] p-8 border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-6" onClick={() => setShowSettings(false)} />
          <div className="space-y-8 max-w-lg mx-auto text-white">
            <BackgroundPicker onSelect={updateBackground} />
            <div className="flex flex-col gap-3">
              <span className="text-white/60 text-xs uppercase font-bold tracking-widest px-1">Acciones Rápidas</span>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => checkAnniversary()} className="flex items-center justify-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <Bell className="w-5 h-5 text-orange-300" />
                  <span className="text-sm font-medium">Actualizar</span>
                </button>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center justify-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium">Limpiar</span>
                </button>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full bg-white text-pink-600 font-bold py-4 rounded-2xl">Cerrar</button>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-6 left-6 right-6 z-50 bg-white/20 backdrop-blur-md border border-white/30 h-16 rounded-3xl flex justify-around items-center px-4 shadow-xl">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-white/20 scale-110' : 'text-white/60'}`}>
          <Heart className={`w-6 h-6 ${activeTab === 'home' ? 'fill-orange-400 text-orange-400' : ''}`} />
        </button>
        <button onClick={() => setActiveTab('calendar')} className={`p-3 rounded-2xl transition-all ${activeTab === 'calendar' ? 'bg-white/20 scale-110 text-white' : 'text-white/60'}`}>
          <Calendar className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('memories')} className={`p-3 rounded-2xl transition-all ${activeTab === 'memories' ? 'bg-white/20 scale-110 text-white' : 'text-white/60'}`}>
          <ImageIcon className="w-6 h-6" />
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default App;
