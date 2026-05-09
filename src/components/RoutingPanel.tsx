import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  MapPin, 
  ArrowRight, 
  Wind, 
  CircleAlert,
  Search,
  Route as RouteIcon,
  ChevronDown,
  Truck,
  Ambulance as AmbulanceIcon,
  Plane,
  Clock,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { VehicleType, RouteInfo } from '../types';

interface RoutingPanelProps {
  onRoute: (origin: string, destination: string, vehicle: VehicleType) => void;
  isRouting: boolean;
  activeRoutes?: RouteInfo[];
  onToggleStatus?: (id: string) => void;
}

export function RoutingPanel({ onRoute, isRouting, activeRoutes = [], onToggleStatus }: RoutingPanelProps) {
  const [origin, setOrigin] = useState("MG Road Metro");
  const [destination, setDestination] = useState("Whitefield EPIP");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.AMBULANCE);

  const vehicles = [
    { type: VehicleType.AMBULANCE, icon: AmbulanceIcon, label: 'Ambulance' },
    { type: VehicleType.TRUCK, icon: Truck, label: 'Supply Truck' },
    { type: VehicleType.DRONE, icon: Plane, label: 'Swift Drone' },
  ];

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 scrollbar-hide">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1">Mission Logistics</label>
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Zap className="h-2.5 w-2.5" />
            REAL-TIME CALC
          </div>
        </div>
        
        <div className="relative space-y-2">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-zinc-800" />
          
          <div className={cn(
            "relative flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 transition-colors",
            "focus-within:border-amber-500/50"
          )}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <MapPin className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black uppercase tracking-wider text-zinc-600">Deployment Node</p>
              <input 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-zinc-200 outline-none placeholder:text-zinc-700" 
                placeholder="Search starting point..."
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center -my-2.5 z-10">
            <div className="rounded-full bg-zinc-900 border border-zinc-800 p-1.5">
               <ChevronDown className="h-3 w-3 text-zinc-600" />
            </div>
          </div>

          <div className={cn(
            "relative flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 transition-colors",
            "focus-within:border-rose-500/50"
          )}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <Navigation className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black uppercase tracking-wider text-zinc-600">Extraction Zone</p>
              <input 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-zinc-200 outline-none placeholder:text-zinc-700" 
                placeholder="Target rescue zone..."
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="grid grid-cols-3 gap-2">
           {vehicles.map((v) => (
             <button
               key={v.type}
               onClick={() => setSelectedVehicle(v.type)}
               className={cn(
                 "flex flex-col items-center gap-2 rounded-xl border p-2.5 transition-all",
                 selectedVehicle === v.type 
                   ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20" 
                   : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700"
               )}
             >
               <v.icon className={cn("h-4 w-4", selectedVehicle === v.type ? "text-amber-500" : "text-zinc-600")} />
               <span className="text-[8px] font-black uppercase tracking-tighter">{v.label}</span>
             </button>
           ))}
        </div>

        <button 
          onClick={() => onRoute(origin, destination, selectedVehicle)}
          disabled={isRouting}
          className="group relative w-full overflow-hidden rounded-xl bg-amber-500 py-3.5 text-zinc-950 shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            {isRouting ? "Calculating Vector..." : "Deploy Asset"}
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        {/* Tactical Calculation Logs */}
        <AnimatePresence>
          {isRouting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[7px] font-black uppercase text-amber-500/60">
                <span>Neural Link Status</span>
                <span className="animate-pulse">Solving...</span>
              </div>
              <div className="space-y-1 font-mono text-[8px] text-amber-500/80">
                <div className="flex justify-between">
                  <span>INIT_LINK</span>
                  <span className="text-emerald-500">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>HAZARD_AVOIDANCE</span>
                  <motion.span 
                    animate={{ opacity: [0, 1] }} 
                    transition={{ duration: 0.2, repeat: Infinity }}
                  >CALC</motion.span>
                </div>
                <div className="flex justify-between">
                  <span>TERRAIN_ANALYSIS</span>
                  <span>PENDING</span>
                </div>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.4, ease: "linear" }}
                  className="h-full bg-amber-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Active Missions */}
      <AnimatePresence>
        {activeRoutes.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-4 border-t border-zinc-800"
          >
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Missions</label>
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            </div>

            <div className="space-y-3">
              {activeRoutes.map((route) => (
                <div key={route.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 space-y-3 relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       {route.vehicleType === VehicleType.AMBULANCE && <AmbulanceIcon className="h-3 w-3 text-rose-500" />}
                       {route.vehicleType === VehicleType.TRUCK && <Truck className="h-3 w-3 text-amber-500" />}
                       {route.vehicleType === VehicleType.DRONE && <Plane className="h-3 w-3 text-blue-500" />}
                       <span className="text-[9px] font-black text-white uppercase tracking-tighter">{route.vehicleType} #{route.id.slice(-4)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                       <Clock className="h-2.5 w-2.5 text-zinc-500" />
                       <span className="text-[9px] font-mono font-bold text-amber-500">{route.eta}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-medium text-zinc-400 flex-1 truncate">{route.origin.name}</div>
                    <ArrowRight className="h-3 w-3 text-zinc-600" />
                    <div className="text-[10px] font-medium text-zinc-400 flex-1 truncate text-right">{route.dest.name}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-800/50">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[7px] font-black text-zinc-600 uppercase">Terrain</span>
                       <span className="text-[9px] font-bold text-zinc-300">{route.terrainType}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[7px] font-black text-zinc-600 uppercase">Safety Index</span>
                       <span className={cn(
                         "text-[9px] font-bold",
                         route.status === 'BLOCKED' ? "text-rose-500" : (route.safetyScore > 0.9 ? "text-emerald-500" : "text-amber-500")
                       )}>{route.status === 'BLOCKED' ? 'FAIL' : `${(route.safetyScore * 100).toFixed(0)}%`}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[7px] font-black text-zinc-600 uppercase">Energy</span>
                       <span className="text-[9px] font-bold text-blue-400">{(route.fuelLevel * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1">
                    <div className="flex items-center gap-2">
                      <span>DIST: {route.distance}</span>
                      {route.status === 'BLOCKED' && (
                        <span className="flex items-center gap-1 text-rose-500 font-bold">
                          <CircleAlert className="h-2 w-2" />
                          VECTOR BLOCKED
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onToggleStatus?.(route.id)}
                      className={cn(
                        "flex items-center gap-1 rounded bg-zinc-950 px-2 py-1 border transition-all text-[8px] font-black uppercase",
                        route.status === 'ACTIVE' 
                          ? "border-zinc-800 text-amber-500 hover:border-amber-500/50" 
                          : "border-rose-500/50 text-emerald-500 bg-rose-500/5 hover:bg-emerald-500/5 hover:border-emerald-500/50"
                      )}
                    >
                      {route.status === 'ACTIVE' ? "Simulate Block" : "Clear Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="space-y-3 pt-2">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1">System Overrides</label>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/30 p-3">
             <div className="flex items-center gap-3">
                <Wind className="h-4 w-4 text-zinc-500" />
                <span className="text-[11px] text-zinc-300">Avoid Flooded Roads</span>
             </div>
             <div className="h-4 w-8 rounded-full bg-amber-500/20 p-0.5 flex justify-end">
                <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
             </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/30 p-3">
             <div className="flex items-center gap-3">
                <RouteIcon className="h-4 w-4 text-zinc-500" />
                <span className="text-[11px] text-zinc-300">Off-Road Navigation</span>
             </div>
             <div className="h-4 w-8 rounded-full bg-zinc-800 p-0.5 flex justify-start">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
             </div>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <CircleAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-zinc-500">
            Current routing vector bypasses <span className="text-rose-500 font-bold">SECTOR A-01</span> due to critical structural failure thresholds.
          </p>
        </div>
      </section>
    </div>
  );
}
