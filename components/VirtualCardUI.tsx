
import React from 'react';
import { VirtualCard } from '../types';

interface VirtualCardUIProps {
  card: VirtualCard;
  focused?: boolean;
}

const VirtualCardUI: React.FC<VirtualCardUIProps> = ({ card, focused }) => {
  return (
    <div className={`relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 ${focused ? 'scale-105' : 'scale-95 opacity-80'}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black p-6 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-3xl -z-0"></div>
        
        {/* Chip & Logo */}
        <div className="flex justify-between items-start relative z-10">
          <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-80"></div>
          <div className="flex flex-col items-end">
             <span className="text-white font-bold italic text-xl">VISA</span>
             <span className="text-[10px] text-white/50 tracking-widest uppercase">Virtual</span>
          </div>
        </div>

        {/* Number */}
        <div className="relative z-10">
          <p className="text-xl font-mono text-white tracking-[0.2em]">
            {card.number.replace(/\d{4}(?=.)/g, '$& ')}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-end relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-tighter">Card Holder</span>
            <span className="text-sm font-medium text-white uppercase">{card.label}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-tighter">Expiry</span>
              <span className="text-sm font-medium text-white">{card.expiry}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-tighter">CVV</span>
              <span className="text-sm font-medium text-white">***</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCardUI;
