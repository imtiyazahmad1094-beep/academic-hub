import React from 'react';

export const FloatingDoodles: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {/* ================= LEFT MARGIN DOODLES ================= */}
      <div className="absolute left-2 lg:left-4 xl:left-8 top-24 hidden md:flex flex-col items-center gap-16 opacity-75 hover:opacity-100 transition-opacity">
        {/* Stylized Notebook */}
        <div 
          id="doodle-notebook"
          className="animate-float-slow transform -rotate-6 w-24 h-32 lg:w-28 lg:h-36 rounded-xl shadow-lg bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300/80 p-2 relative flex flex-col justify-between"
        >
          {/* Notebook Spiral Binding */}
          <div className="absolute -left-3 top-2 bottom-2 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-4 h-2 bg-slate-400 rounded-full border border-slate-600 shadow-sm transform -rotate-12" />
            ))}
          </div>
          {/* Lined Pages */}
          <div className="bg-white/90 rounded-lg h-full p-2.5 flex flex-col gap-2 border border-amber-200/60 shadow-inner">
            <div className="w-10 h-1.5 bg-amber-400/70 rounded-full mb-1" />
            <div className="w-full h-0.5 bg-sky-200 rounded-full" />
            <div className="w-full h-0.5 bg-sky-200 rounded-full" />
            <div className="w-4/5 h-0.5 bg-sky-200 rounded-full" />
            <div className="w-full h-0.5 bg-sky-200 rounded-full" />
            <div className="w-3/4 h-0.5 bg-sky-200 rounded-full" />
          </div>
          {/* Sticky bookmark tags */}
          <div className="absolute -top-1 right-2 w-3 h-4 bg-rose-400 rounded-t-sm shadow-sm" />
          <div className="absolute -top-1 right-6 w-3 h-4 bg-teal-400 rounded-t-sm shadow-sm" />
          <span className="absolute bottom-1 right-2 text-[8px] font-handwritten text-amber-700 font-bold">Abstracts</span>
        </div>

        {/* Stylized Sharp Pencil */}
        <div 
          id="doodle-pencil"
          className="animate-float-reverse transform rotate-45 w-6 h-36 lg:h-44 relative flex flex-col items-center"
        >
          {/* Pencil Tip (Graphite) */}
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-amber-200 relative">
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-slate-800" />
          </div>
          {/* Pencil Wooden Body with 3 facets */}
          <div className="w-6 h-24 lg:h-32 bg-amber-400 border-x-2 border-amber-500 flex justify-between shadow-md relative overflow-hidden">
            <div className="w-1.5 h-full bg-amber-300" />
            <div className="w-1.5 h-full bg-amber-500" />
            {/* Pencil Brand text */}
            <span className="absolute top-8 left-1 text-[7px] text-amber-800 tracking-widest font-mono uppercase transform rotate-90 origin-left">ACADEMIC 2B</span>
          </div>
          {/* Metal Ferrule */}
          <div className="w-6 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 border-y border-slate-400" />
          {/* Pink Eraser */}
          <div className="w-6 h-5 bg-rose-400 rounded-b-md border-b-2 border-rose-500 shadow-sm" />
        </div>

        {/* Playful Floating Paperclip */}
        <div 
          id="doodle-paperclip"
          className="animate-float-gentle transform -rotate-12 w-6 h-14 rounded-full border-3 border-teal-500/70 relative shadow-sm"
        >
          <div className="absolute top-1.5 left-0.5 right-0.5 bottom-2 rounded-full border-2 border-teal-600/70 border-b-0" />
        </div>
      </div>

      {/* ================= RIGHT MARGIN DOODLES ================= */}
      <div className="absolute right-2 lg:right-4 xl:right-8 top-28 hidden md:flex flex-col items-center gap-16 opacity-75 hover:opacity-100 transition-opacity">
        {/* Stylized Fountain / Gel Pen */}
        <div 
          id="doodle-pen"
          className="animate-float-reverse transform -rotate-45 w-5 h-40 lg:h-48 relative flex flex-col items-center"
        >
          {/* Pen Nib (Metallic Fountain Nib) */}
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[22px] border-b-slate-300 relative shadow-sm">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-700" />
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
          {/* Pen Grip Section */}
          <div className="w-4 h-6 bg-slate-700 rounded-t-sm" />
          {/* Metallic Ring */}
          <div className="w-5 h-2 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 shadow-sm" />
          {/* Pen Barrel Body */}
          <div className="w-5 h-24 lg:h-28 bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-700 rounded-b-md shadow-md relative">
            {/* Pen Clip */}
            <div className="absolute top-1 right-[-3px] w-1.5 h-14 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full shadow-md border border-amber-600" />
          </div>
        </div>

        {/* Stylized Pastel Highlighter Marker */}
        <div 
          id="doodle-highlighter"
          className="animate-float-slow transform rotate-12 w-8 h-28 relative flex flex-col items-center"
        >
          {/* Translucent Chisel Tip */}
          <div className="w-4 h-4 bg-emerald-400 transform skew-x-12 rounded-t-xs shadow-sm" />
          {/* Cap Base */}
          <div className="w-8 h-4 bg-slate-800 rounded-t-sm" />
          {/* Marker Body */}
          <div className="w-8 h-20 bg-gradient-to-r from-emerald-300 via-mint-200 to-emerald-400 rounded-b-lg border border-emerald-500/50 shadow-md flex flex-col items-center justify-center">
            <span className="text-[7px] font-bold text-emerald-900 font-mono transform rotate-90 tracking-wider">HIGHLIGHT</span>
          </div>
        </div>

        {/* Stylized Wooden Ruler */}
        <div 
          id="doodle-ruler"
          className="animate-float-gentle transform -rotate-15 w-8 h-36 bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-md shadow-md p-1 flex flex-col justify-between"
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`h-0.5 bg-amber-800 ${i % 3 === 0 ? 'w-4' : 'w-2'}`} />
              {i % 3 === 0 && <span className="text-[7px] font-mono text-amber-900 font-bold">{i}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
