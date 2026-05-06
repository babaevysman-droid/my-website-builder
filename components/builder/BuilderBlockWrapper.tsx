"use client";

import { useBuilderStore } from '@/store/useBuilderStore';
import { Trash, Copy, ArrowUp, ArrowDown, Settings } from 'lucide-react'; // Убедись, что установлен lucide-react

interface WrapperProps {
  id: string;
  children: React.ReactNode;
}

export default function BuilderBlockWrapper({ id, children }: WrapperProps) {
  const { selectedBlockId, selectBlock, removeBlock, duplicateBlock, moveBlock } = useBuilderStore();
  const isSelected = selectedBlockId === id;

  return (
    <div 
      className={`relative group border-2 transition-all duration-200 ${
        isSelected ? 'border-red-600 z-10' : 'border-transparent hover:border-white/20'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(id);
      }}
    >
      {/* Tilda-style Control Panel (появляется при ховере или если блок выбран) */}
      <div className={`absolute top-0 right-0 -translate-y-full flex items-center gap-1 bg-[#151515] p-1 rounded-t-lg border border-b-0 ${
        isSelected ? 'border-red-600 opacity-100' : 'border-white/20 opacity-0 group-hover:opacity-100'
      } transition-opacity duration-200 z-20`}>
        
        <button onClick={() => selectBlock(id)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md text-xs font-medium flex items-center gap-1">
          <Settings size={14} /> Настройки
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={(e) => { e.stopPropagation(); moveBlock(id, 'up'); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md">
          <ArrowUp size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); moveBlock(id, 'down'); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md">
          <ArrowDown size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(id); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md">
          <Copy size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); removeBlock(id); }} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-colors">
          <Trash size={16} />
        </button>
      </div>

      {/* Сам контент блока */}
      <div className={`${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'} transition-opacity`}>
        {children}
      </div>
    </div>
  );
}