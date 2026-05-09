import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Loader2, 
  Scan,
  ShieldAlert,
  ChevronDown,
  Settings2,
  Plus,
  Trash2,
  FileSearch,
  Eye,
  EyeOff,
  LayoutGrid
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';
import { DamageLevel, DamageReport } from '@/src/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SAMPLES = [
  { id: 'blr_central', name: 'Majestic Hub', url: 'https://images.unsplash.com/photo-1544984243-75a602b77ca1?q=80&w=1000' },
  { id: 'blr_east', name: 'Indiranagar', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000' },
  { id: 'blr_airport', name: 'Kempegowda Int', url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=1000' },
];

export function AnalysisPanel({ onDetected }: { onDetected: (reports: DamageReport[]) => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [results, setResults] = useState<DamageReport[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'source' | 'mask' | 'overlay'>('source');
  
  // Form State
  const [newReport, setNewReport] = useState<Partial<DamageReport>>({
    lat: 12.9716,
    lng: 77.5946,
    level: DamageLevel.MEDIUM,
    type: 'STRUCTURAL',
    description: '',
    confidence: 0.85
  });

  // Sync results to parent whenever they change
  useEffect(() => {
    onDetected(results);
  }, [results, onDetected]);

  const updateReport = (id: string, updates: Partial<DamageReport>) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeReport = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => setResults([]);

  const simulateChaos = () => {
    const chaosReports: DamageReport[] = Array.from({ length: 6 }).map((_, i) => ({
      id: `chaos-${Math.random().toString(36).substr(2, 5)}`,
      lat: 12.95 + Math.random() * 0.05,
      lng: 77.57 + Math.random() * 0.05,
      level: [DamageLevel.MEDIUM, DamageLevel.HIGH, DamageLevel.CRITICAL][Math.floor(Math.random() * 3)],
      type: ['STRUCTURAL', 'INFRASTRUCTURE', 'FLOODING', 'FIRE'][Math.floor(Math.random() * 4)] as any,
      description: `Automated chaos vector ${i + 1}: Unpredictable anomaly detected in local subnet.`,
      timestamp: new Date(),
      confidence: 0.7 + Math.random() * 0.3
    }));
    setResults(prev => [...chaosReports, ...prev]);
  };

  const handleManualAdd = () => {
    const report: DamageReport = {
      ...newReport as DamageReport,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setResults(prev => [report, ...prev]);
    setShowAddForm(false);
    // Reset form
    setNewReport({
      lat: 12.9716,
      lng: 77.5946,
      level: DamageLevel.MEDIUM,
      type: 'STRUCTURAL',
      description: '',
      confidence: 0.85
    });
  };

  const runAnalysis = async () => {
    if (!selectedImg) return;
    setAnalyzing(true);
    setViewMode('source');
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          { text: "Analyze this simulated satellite image of Bangalore. Identify 3 potential areas of 'simulated' structural damage or flooding. Return a JSON array: { lat, lng, level: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL', type: 'STRUCTURAL'|'FLOODING', description, confidence: 0-1 }. Coordinates: 12.97, 77.59. JSON ONLY." },
          { inlineData: { data: selectedImg.split(',')[1] || '', mimeType: "image/jpeg" } }
        ],
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '[]');
      const reports = data.map((d: any) => ({ 
        ...d, 
        id: Math.random().toString(36).substr(2, 9), 
        timestamp: new Date(), 
        confidence: d.confidence || 0.85 
      }));
      setResults(prev => [...reports, ...prev]);
      setViewMode('overlay');
    } catch (error) {
      // Fallback Data
      const fallback = [
        { id: Math.random().toString(36).substr(2, 9), lat: 12.9716, lng: 77.5946, level: DamageLevel.HIGH, type: 'STRUCTURAL' as const, description: 'Structural stress on metro pillar nodes.', timestamp: new Date(), confidence: 0.92 },
        { id: Math.random().toString(36).substr(2, 9), lat: 12.9800, lng: 77.6000, level: DamageLevel.MEDIUM, type: 'FLOODING' as const, description: 'Accumulation in low-lying residential sectors.', timestamp: new Date(), confidence: 0.78 },
      ];
      setResults(prev => [...fallback, ...prev]);
      setViewMode('overlay');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[80vh] scrollbar-hide pr-1">
      <div className="space-y-1 border-b border-zinc-800 pb-4">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black tracking-tighter text-white">
             AEGIS <span className="text-amber-500">DISASTER INTEL</span>
           </h2>
           <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
             GEOINT v3.0
           </div>
        </div>
        <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.2em]">Autonomous Geospatial Reconnaissance</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1 flex items-center gap-2">
            <Settings2 className="h-3 w-3" />
            Imagery Selection
          </label>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {SAMPLES.map(s => (
            <button 
              key={s.id}
              onClick={() => setSelectedImg(s.url)}
              className={cn(
                "group relative h-16 overflow-hidden rounded-lg border transition-all",
                selectedImg === s.url ? "border-amber-500 ring-2 ring-amber-500/50" : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <img src={s.url} alt={s.name} className="h-full w-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60" />
              <div className="absolute inset-x-0 bottom-1 p-1">
                <p className="text-[6px] font-black text-white truncate text-center uppercase tracking-tighter">{s.name}</p>
              </div>
            </button>
          ))}
          
          <div className="relative group h-16 overflow-hidden rounded-lg border border-dashed border-zinc-800 bg-zinc-900/10 transition-all hover:border-amber-500/50 hover:bg-amber-500/5">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (re) => setSelectedImg(re.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} 
              className="absolute inset-0 z-10 cursor-pointer opacity-0" 
            />
            <div className="flex h-full flex-col items-center justify-center p-1">
              <Upload className="mb-1 h-3.5 w-3.5 text-zinc-600 group-hover:text-amber-500 transition-colors" />
              <p className="text-[6px] font-black uppercase text-zinc-500 tracking-tighter text-center leading-tight">Upload<br/>Custom</p>
            </div>
            {selectedImg && !SAMPLES.some(s => s.url === selectedImg) && (
              <div className="absolute inset-0 pointer-events-none border-2 border-amber-500 animate-pulse rounded-lg" />
            )}
          </div>
        </div>
      </section>

      {selectedImg && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 ring-1 ring-white/5 shadow-2xl">
            {/* Multi-view Container */}
            <div className="relative aspect-video w-full overflow-hidden">
               <img 
                 src={selectedImg} 
                 className={cn(
                   "h-full w-full object-cover transition-all duration-700",
                   viewMode === 'source' ? "grayscale brightness-75" : 
                   viewMode === 'mask' ? "invert brightness-150 contrast-150 hue-rotate-[180deg]" : 
                   "grayscale brightness-50"
                 )} 
               />
               
               {/* Mask Overlays during analysis */}
               {analyzing && (
                 <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm">
                   <div className="text-center">
                     <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-500" />
                     <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">Processing U-Net Nodes...</p>
                   </div>
                 </div>
               )}

               {/* Simulated Scanning Line */}
               {analyzing && (
                 <motion.div 
                   initial={{ top: "0%" }}
                   animate={{ top: "100%" }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 right-0 h-0.5 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.8)] blur-[0.5px] z-10"
                 />
               )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex border-t border-zinc-800 bg-zinc-900/50">
               {(['source', 'mask', 'overlay'] as const).map((mode) => (
                 <button
                   key={mode}
                   onClick={() => setViewMode(mode)}
                   className={cn(
                     "flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest transition-colors",
                     viewMode === mode ? "bg-amber-500 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                   )}
                 >
                   {mode}
                 </button>
               ))}
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               {!analyzing && viewMode === 'source' && (
                 <button 
                    onClick={runAnalysis}
                    className="pointer-events-auto flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-[10px] font-black uppercase text-zinc-950 shadow-2xl transition-all hover:scale-105 active:scale-95"
                 >
                    <Scan className="h-3 w-3" />
                    Analyze Feed
                 </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center gap-2 pt-2">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all",
            showAddForm ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          )}
        >
          <Plus className={cn("h-3 w-3 transition-transform", showAddForm && "rotate-45")} />
          {showAddForm ? "Cancel Entry" : "Add New Simulated Report"}
        </button>
        {results.length > 0 && (
          <button 
            onClick={clearAll}
            className="flex h-9 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <button 
          onClick={simulateChaos}
          className="flex h-9 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/20 transition-all"
          title="Simulate Chaos"
        >
          <ShieldAlert className="h-4 w-4 animate-pulse" />
        </button>
      </div>

      {/* Manual Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-inner">
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500">Latitude</label>
                    <input 
                      type="number" 
                      value={newReport.lat}
                      onChange={(e) => setNewReport({...newReport, lat: parseFloat(e.target.value)})}
                      className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300 outline-none focus:border-amber-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500">Longitude</label>
                    <input 
                      type="number" 
                      value={newReport.lng}
                      onChange={(e) => setNewReport({...newReport, lng: parseFloat(e.target.value)})}
                      className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300 outline-none focus:border-amber-500" 
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500">Damage Level</label>
                    <select 
                      value={newReport.level}
                      onChange={(e) => setNewReport({...newReport, level: e.target.value as DamageLevel})}
                      className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300 outline-none"
                    >
                      {Object.values(DamageLevel).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500">Hazard Category</label>
                    <select 
                      value={newReport.type}
                      onChange={(e) => setNewReport({...newReport, type: e.target.value as any})}
                      className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300 outline-none"
                    >
                      <option value="STRUCTURAL">STRUCTURAL</option>
                      <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                      <option value="FLOODING">FLOODING</option>
                      <option value="FIRE">FIRE</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-zinc-500">Description / Sitrep</label>
                  <textarea 
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    placeholder="Describe the anomalies..."
                    className="w-full h-16 rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] text-zinc-300 outline-none focus:border-amber-500 resize-none"
                  />
               </div>

               <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] font-black uppercase text-zinc-500">Intelligence Confidence</label>
                    <span className="text-[10px] font-mono text-amber-500">{(newReport.confidence! * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={newReport.confidence}
                    onChange={(e) => setNewReport({...newReport, confidence: parseFloat(e.target.value)})}
                    className="w-full h-1 bg-zinc-900 rounded appearance-none cursor-pointer accent-amber-500" 
                  />
               </div>

               <button 
                  onClick={handleManualAdd}
                  className="w-full rounded-xl bg-amber-500 py-2.5 text-[10px] font-black uppercase text-zinc-950 shadow-lg active:scale-95 transition-transform"
               >
                  Verify & Inject into Engine
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Detected Intels ({results.length})</label>
              <LayoutGrid className="h-3 w-3 text-zinc-600" />
            </div>
            <div className="space-y-4">
              {results.map((r) => (
                <motion.div 
                  layout
                  key={r.id} 
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3 hover:border-zinc-700 transition-colors"
                >
                   <div className="flex items-center justify-between">
                     <span className={cn(
                       "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ring-1 ring-inset",
                       r.level === DamageLevel.CRITICAL ? "bg-rose-500/10 text-rose-500 ring-rose-500/20" : 
                       r.level === DamageLevel.HIGH ? "bg-orange-500/10 text-orange-500 ring-orange-500/20" : "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                     )}>
                       {r.type}
                     </span>
                     <div className="flex items-center gap-3">
                        <select 
                          value={r.level}
                          onChange={(e) => updateReport(r.id, { level: e.target.value as DamageLevel })}
                          className="bg-transparent text-[9px] font-bold text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 outline-none"
                        >
                          {Object.values(DamageLevel).map(l => <option key={l} value={l} className="bg-zinc-900">{l}</option>)}
                        </select>
                        <button 
                          onClick={() => removeReport(r.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-rose-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                     </div>
                   </div>

                   <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
                    "{r.description || 'System-generated analysis pending manual sitrep.'}"
                   </p>

                   <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <ShieldAlert className={cn("h-3 w-3", r.confidence > 0.8 ? "text-emerald-500" : "text-amber-500")} />
                           <span className="text-[9px] font-black text-zinc-500 uppercase">Integrity Score</span>
                         </div>
                         <span className="text-[10px] font-mono text-zinc-300">{(r.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${r.confidence * 100}%` }}
                          className={cn(
                            "h-full transition-all duration-1000",
                            r.confidence > 0.8 ? "bg-emerald-500" : 
                            r.confidence > 0.5 ? "bg-amber-500" : "bg-rose-500"
                          )}
                        />
                      </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
