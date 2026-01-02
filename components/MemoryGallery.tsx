
import React, { useState } from 'react';
import { Plus, Trash2, Camera, X } from 'lucide-react';
import { Memory } from '../types';

interface Props {
  memories: Memory[];
  onAdd: (memory: Memory) => void;
  onDelete: (id: string) => void;
}

const MemoryGallery: React.FC<Props> = ({ memories, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempImage && newCaption) {
      onAdd({
        id: Date.now().toString(),
        imageUrl: tempImage,
        caption: newCaption,
        date: new Date().toLocaleDateString()
      });
      setTempImage(null);
      setNewCaption('');
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-2xl font-romantic">Nuestros Recuerdos</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white hover:bg-white/40 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h4 className="text-pink-600 font-bold uppercase text-xs tracking-widest">Añadir Recuerdo</h4>
              <button onClick={() => setIsAdding(false)}><X className="text-gray-400" /></button>
            </div>
            
            <label className="block w-full h-48 border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-pink-50 hover:bg-pink-100 transition-colors">
              {tempImage ? (
                <img src={tempImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-pink-300 mb-2" />
                  <span className="text-pink-400 text-xs font-medium">Pulsa para elegir foto</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            <input 
              type="text" 
              placeholder="Escribe algo sobre este momento..."
              className="w-full p-4 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-pink-300 outline-none"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />

            <button 
              onClick={handleSubmit}
              disabled={!tempImage || !newCaption}
              className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
            >
              Guardar Recuerdo
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {memories.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-white/40 text-sm italic">Aún no hay fotos. ¡Añade nuestro primer recuerdo!</p>
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.id} className="group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-xl animate-fadeIn">
              <img src={memory.imageUrl} alt={memory.caption} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="text-white text-[10px] leading-tight line-clamp-2">{memory.caption}</p>
                <span className="text-white/40 text-[8px] block mt-1 uppercase font-bold">{memory.date}</span>
              </div>
              <button 
                onClick={() => onDelete(memory.id)}
                className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoryGallery;
