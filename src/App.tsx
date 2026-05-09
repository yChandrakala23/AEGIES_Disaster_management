import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AnalysisPanel } from './components/AnalysisPanel';
import { RoutingPanel } from './components/RoutingPanel';
import { RiskAnalysis } from './components/RiskAnalysis';
import { SimulatedMap } from './components/SimulatedMap';
import { DamageReport, DamageLevel, VehicleType, RouteInfo } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  User, 
  Satellite,
  Radio,
  Wifi,
  CloudRain
} from 'lucide-react';

const INITIAL_REPORTS: DamageReport[] = [
  { id: 'init-1', lat: 12.9716, lng: 77.5946, level: DamageLevel.HIGH, type: 'STRUCTURAL', description: 'Structural baseline check: Stress fractures detected in pillar N-12.', timestamp: new Date(), confidence: 0.88 },
  { id: 'init-2', lat: 12.9850, lng: 77.5890, level: DamageLevel.CRITICAL, type: 'FLOODING', description: 'Critical water level breach in Sector 4. Drainage capacity exceeded.', timestamp: new Date(), confidence: 0.95 },
  { id: 'init-3', lat: 12.9750, lng: 77.6000, level: DamageLevel.HIGH, type: 'FIRE', description: 'Substation electrical fire. Thermal signature rising.', timestamp: new Date(), confidence: 0.92 },
  { id: 'init-4', lat: 12.9650, lng: 77.5850, level: DamageLevel.MEDIUM, type: 'INFRASTRUCTURE', description: 'Power grid instability. Line sag detected on main trunk.', timestamp: new Date(), confidence: 0.84 },
  { id: 'init-5', lat: 12.9900, lng: 77.6100, level: DamageLevel.CRITICAL, type: 'STRUCTURAL', description: 'Road collapse on main artery. Ground liquefaction suspected.', timestamp: new Date(), confidence: 0.97 },
  { id: 'init-6', lat: 12.9550, lng: 77.6050, level: DamageLevel.MEDIUM, type: 'FLOODING', description: 'Sewage backup in residential block G.', timestamp: new Date(), confidence: 0.76 },
  { id: 'init-7', lat: 12.9800, lng: 77.5750, level: DamageLevel.HIGH, type: 'FIRE', description: 'Gas leak reported with ignition risk in storage yard.', timestamp: new Date(), confidence: 0.89 },
  { id: 'init-8', lat: 12.9600, lng: 77.5700, level: DamageLevel.LOW, type: 'STRUCTURAL', description: 'Minor debris blockage on secondary access route.', timestamp: new Date(), confidence: 0.98 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState<DamageReport[]>(INITIAL_REPORTS);
  const [activeRoutes, setActiveRoutes] = useState<RouteInfo[]>([]);
  const [isRouting, setIsRouting] = useState(false);

  const toggleRouteStatus = (id: string) => {
    setActiveRoutes(prev => prev.map(route => 
      route.id === id 
        ? { ...route, status: route.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
        : route
    ));
  };

  const handleRoute = (originName: string, destName: string, vehicle: VehicleType) => {
    setIsRouting(true);
    
    // Simulate a "Tactical Solving" phase
    const id = Math.random().toString(36).substr(2, 9);
    const safetyScore = 0.85 + Math.random() * 0.15;
    const terrainTypes: ('PAVED' | 'DEBRIS' | 'OFF-ROAD' | 'WATER')[] = ['PAVED', 'DEBRIS', 'OFF-ROAD'];
    
    // Generate a more complex multi-point path
    let path: { lat: number; lng: number }[] = [];
    const stepCount = vehicle === VehicleType.DRONE ? 4 : 8;
    const startLat = 12.9716;
    const startLng = 77.5946;
    const endLat = 12.9850;
    const endLng = 77.5890;

    path.push({ lat: startLat, lng: startLng });

    for (let i = 1; i < stepCount; i++) {
       const ratio = i / stepCount;
       // Add some "tactical variance" to the path to dodge hazards
       const variance = (Math.random() - 0.5) * 0.01;
       path.push({
         lat: startLat + (endLat - startLat) * ratio + (vehicle === VehicleType.DRONE ? variance * 0.5 : variance),
         lng: startLng + (endLng - startLng) * ratio + (vehicle === VehicleType.DRONE ? variance * 0.5 : variance)
       });
    }

    path.push({ lat: endLat, lng: endLng });

    const newRoute: RouteInfo = {
      id,
      origin: { lat: startLat, lng: startLng, name: originName },
      dest: { lat: endLat, lng: endLng, name: destName },
      path,
      vehicleType: vehicle,
      eta: vehicle === VehicleType.DRONE ? "03m 45s" : "14m 20s",
      distance: vehicle === VehicleType.DRONE ? "2.8km" : "4.1km",
      status: 'ACTIVE',
      safetyScore,
      fuelLevel: 0.9 + Math.random() * 0.1,
      terrainType: terrainTypes[Math.floor(Math.random() * terrainTypes.length)]
    };

    setTimeout(() => {
      setActiveRoutes(prev => [newRoute, ...prev]);
      setIsRouting(false);
    }, 2400);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 font-sans selection:bg-amber-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="absolute top-0 left-0 right-0 z-20 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/40 px-8 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Tactical Simulation</span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-4 text-zinc-500">
               <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-emerald-500">
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">SIM LINK: ACTIVE</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="DIGITAL TWIN SEARCH..." 
                  className="w-48 rounded-full border border-zinc-800 bg-zinc-900/50 py-1.5 pl-9 pr-4 text-[10px] font-medium text-zinc-300 outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all"
                />
             </div>
             <button className="relative rounded-full border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 hover:text-white transition-all">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
             </button>
             <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-900/50 p-0.5">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                   <User className="h-4 w-4 text-zinc-950" />
                </div>
             </div>
          </div>
        </header>

        {/* HUD Elements overlaying the map */}
        <div className="absolute top-20 right-8 z-30 w-80 space-y-4">
           {/* Active Control Panel */}
           <motion.div 
             key={activeTab}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl"
           >
              {activeTab === 'overview' && (
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight">Zone Monitoring</h3>
                      <Radio className="h-4 w-4 animate-pulse text-amber-500" />
                   </div>
                   <div className="space-y-3">
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Digital Twin simulation of Bangalore Central. Visualizing real-time infrastructure resilience and threat vectors.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                         <div className="rounded-lg bg-zinc-900/50 p-2 flex flex-col gap-1 border border-zinc-800">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase">Latency</span>
                            <span className="text-xs font-mono text-emerald-500">12ms</span>
                         </div>
                         <div className="rounded-lg bg-zinc-900/50 p-2 flex flex-col gap-1 border border-zinc-800">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase">Simulation</span>
                            <span className="text-xs font-mono text-amber-500 italic">SANDBOX</span>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'damage' && <AnalysisPanel onDetected={setReports} />}
              {activeTab === 'risk' && (
                <div className="space-y-4">
                   <h3 className="text-sm font-bold text-white uppercase tracking-tight">Geospatial Risk Tiers</h3>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="h-3 w-3 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]" />
                         <span className="text-xs text-zinc-300">Level 5: Critical Impact</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
                         <span className="text-xs text-zinc-300">Level 3: Moderate Risk</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                         <span className="text-xs text-zinc-300">Level 1: Nominal</span>
                      </div>
                   </div>
                   <button className="w-full rounded-xl border border-zinc-800 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all">
                      Recalibrate Risk Engine
                   </button>
                </div>
              )}
              {activeTab === 'routing' && (
                <RoutingPanel 
                  onRoute={handleRoute} 
                  isRouting={isRouting} 
                  activeRoutes={activeRoutes} 
                  onToggleStatus={toggleRouteStatus}
                />
              )}
           </motion.div>

           {/* Metrics Card */}
           <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Node Activity</span>
                <Satellite className="h-3.5 w-3.5 text-zinc-600" />
              </div>
              <div className="flex items-end justify-between">
                 <div className="space-y-1">
                    <span className="text-2xl font-mono font-bold text-white tracking-tighter">0{reports.length + activeRoutes.length}</span>
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Active Threads</p>
                 </div>
                 <div className="flex gap-1 h-8 items-end pb-1">
                    {[4, 10, 6, 12, 8, 14, 9, 7].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 2}px` }}
                        className="w-1 bg-amber-500/30 rounded-t" 
                      />
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Tactical Simulated Map */}
        <div className="flex-1 relative">
          <SimulatedMap reports={reports} activeRoutes={activeRoutes} isRouting={isRouting} />
          
          <AnimatePresence>
            {activeTab === 'risk' && (
              <motion.div 
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                className="absolute inset-0 z-20 bg-zinc-950/80 p-8 overflow-y-auto scrollbar-hide"
              >
                <div className="max-w-6xl mx-auto pt-16">
                   <RiskAnalysis reports={reports} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

