import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Map as MapIcon, 
  Activity, 
  Navigation, 
  Layers, 
  ShieldAlert,
  ChevronRight,
  Database,
  Satellite
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'overview', icon: MapIcon, label: 'Overview', desc: 'Real-time city surveillance' },
  { id: 'damage', icon: Zap, label: 'AI Detection', desc: 'Satellite U-Net analysis' },
  { id: 'risk', icon: ShieldsAlert, label: 'Risk Map', desc: 'Geospatial hazard tiers' },
  { id: 'routing', icon: Navigation, label: 'Emergency Routing', desc: 'Obstruction-aware paths' },
];

function ShieldsAlert(props: any) {
  return <ShieldAlert {...props} />;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="flex h-full w-80 flex-col border-r border-zinc-800 bg-zinc-950 p-4 font-sans text-zinc-100">
      <div className="mb-10 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <Activity className="h-6 w-6 text-zinc-950" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">AEGIES <span className="text-amber-500">v2.0</span></h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Disaster Management Engine</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group relative flex w-full flex-col items-start rounded-xl p-3 transition-all duration-200",
                isActive 
                  ? "bg-zinc-900 ring-1 ring-zinc-800" 
                  : "hover:bg-zinc-900/50"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    isActive ? "bg-amber-500/20 text-amber-500" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {tab.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-indicator">
                    <ChevronRight className="h-4 w-4 text-amber-500" />
                  </motion.div>
                )}
              </div>
              <p className="mt-1 pl-11 text-[11px] text-zinc-500">{tab.desc}</p>
              
              {isActive && (
                <motion.div 
                  layoutId="glow"
                  className="absolute inset-0 -z-10 rounded-xl bg-amber-500/5 blur-xl"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 px-2 pb-4">
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">System Status</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-medium text-emerald-500">ONLINE</span>
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Region</span>
              <span className="font-mono text-zinc-200">BANGALORE, IN</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">U-Net Model</span>
              <span className="font-mono text-amber-500/80 italic text-[10px]">READY</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-2">
           <div className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
              <Database className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Node Context</span>
           </div>
           <div className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
              <Satellite className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Relay</span>
           </div>
        </div>
      </div>
    </div>
  );
}
