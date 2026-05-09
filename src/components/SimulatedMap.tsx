import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DamageReport, DamageLevel, RouteInfo, VehicleType } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { Plane, Truck, Ambulance as AmbulanceIcon, AlertCircle } from 'lucide-react';

// Constants for simulation
const GRID_SIZE = 50;
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 2400;

interface SimulatedMapProps {
  reports: DamageReport[];
  activeRoutes?: RouteInfo[];
  isRouting?: boolean;
  children?: React.ReactNode;
}

export function SimulatedMap({ reports, activeRoutes = [], isRouting = false, children }: SimulatedMapProps) {
  // Generate some "city" features like roads and blocks
  const { roads, blocks, blockedNodes, candidateNodes } = useMemo(() => {
    const lines = [];
    const rects = [];
    const blocked = [];
    const candidates = [];
    
    // Major Roads
    for (let i = 0; i < 20; i++) {
       lines.push({ x1: 0, y1: i * 200, x2: MAP_WIDTH, y2: i * 200 }); // Horizontal
       lines.push({ x1: i * 200, y1: 0, x2: i * 200, y2: MAP_HEIGHT }); // Vertical
    }

    // City Blocks
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        if (Math.random() > 0.3) {
          rects.push({
            x: x * 200 + 40,
            y: y * 200 + 40,
            width: 120,
            height: 120,
            opacity: 0.05 + Math.random() * 0.1
          });
        }
      }
    }

    // Sample Blocked Nodes
    blocked.push({ x: 400, y: 800, label: "ROAD COLLAPSE" });
    blocked.push({ x: 1800, y: 1400, label: "WATER LOGGING" });
    blocked.push({ x: 1200, y: 400, label: "DEBRIS" });

    // Pathfinding candidates
    for (let i = 0; i < 40; i++) {
      candidates.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT
      });
    }

    return { roads: lines, blocks: rects, blockedNodes: blocked, candidateNodes: candidates };
  }, []);

  const getRouteColor = (type: VehicleType) => {
    switch (type) {
      case VehicleType.AMBULANCE: return "#f43f5e";
      case VehicleType.TRUCK: return "#f59e0b";
      case VehicleType.DRONE: return "#3b82f6";
      default: return "#f59e0b";
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#020202] cursor-crosshair">
      {/* Tactical Background Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}
      />

      <div className="relative h-full w-full">
        {/* Animated City Base Layer */}
        <svg 
          className="h-full w-full" 
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Tactical Background Grid (SVG Pattern) */}
          <defs>
            <pattern id="grid-pattern" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#222" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid-pattern)" />

          {/* Tactical Scanning Pulse Overlay */}
          <AnimatePresence>
            {isRouting && (
               <motion.g
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
               >
                  <motion.circle
                     animate={{ r: [0, 800], opacity: [0.3, 0] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                     cx={MAP_WIDTH/2}
                     cy={MAP_HEIGHT/2}
                     fill="none"
                     stroke="#f59e0b"
                     strokeWidth="2"
                  />
                  <motion.circle
                     animate={{ r: [0, 800], opacity: [0.15, 0] }}
                     transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                     cx={MAP_WIDTH/2}
                     cy={MAP_HEIGHT/2}
                     fill="none"
                     stroke="#f59e0b"
                     strokeWidth="1"
                  />
                  
                  {/* Flashing Candidate Nodes */}
                  {candidateNodes.slice(0, 20).map((node, i) => (
                    <motion.circle
                      key={`cand-${i}`}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.6, delay: Math.random() * 2, repeat: Infinity }}
                      cx={node.x}
                      cy={node.y}
                      r="3"
                      fill="#f59e0b"
                    />
                  ))}
               </motion.g>
            )}
          </AnimatePresence>
          {/* City Blocks */}
          {blocks.map((b, i) => (
            <rect 
              key={i} 
              {...b} 
              fill="#f59e0b" 
              rx="4"
            />
          ))}

          {/* Main Artery Roads */}
          {roads.map((r, i) => (
            <line 
              key={i} 
              {...r} 
              stroke="#222" 
              strokeWidth="2" 
              className="opacity-60"
            />
          ))}

          {/* District Boundary Glows */}
          <circle cx={MAP_WIDTH/2 - 400} cy={MAP_HEIGHT/2 - 200} r="400" fill="url(#surveillance-zone)" />
          <circle cx={MAP_WIDTH/2 + 300} cy={MAP_HEIGHT/2 + 400} r="350" fill="url(#risk-zone)" />
          
          <defs>
            <radialGradient id="surveillance-zone">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="risk-zone">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="spectrum-heatmap">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="20%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#fde047" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            <filter id="glow-effect">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <pattern id="noise-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
               <rect width="1" height="1" fill="#fff" opacity="0.3" x="10" y="10" />
               <rect width="1" height="1" fill="#fff" opacity="0.3" x="50" y="30" />
               <rect width="1" height="1" fill="#fff" opacity="0.3" x="80" y="70" />
            </pattern>
          </defs>

          {/* District Labels */}
          <text x={MAP_WIDTH/2 - 600} y={MAP_HEIGHT/2 - 400} fill="#52525b" fontSize="24" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.4em] opacity-30">SECTOR A-01</text>
          <text x={MAP_WIDTH/2 + 500} y={MAP_HEIGHT/2 + 300} fill="#52525b" fontSize="24" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.4em] opacity-30">DISTRICT HUB</text>
          <text x={MAP_WIDTH/2 - 300} y={MAP_HEIGHT/2 + 600} fill="#52525b" fontSize="24" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.4em] opacity-30">WEST WING</text>
          <text x={MAP_WIDTH/2 + 800} y={MAP_HEIGHT/2 - 700} fill="#52525b" fontSize="24" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.4em] opacity-20">NORTH-EAST ZONE</text>
          <text x={MAP_WIDTH/2 - 800} y={MAP_HEIGHT/2} fill="#52525b" fontSize="24" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.4em] opacity-20">DOCKLANDS</text>

          {/* Environmental Interference Overlay (Dynamic) */}
          <AnimatePresence>
            {reports.length > 5 && (
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.03, 0.08, 0.03], x: [-1, 1, -0.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, repeat: Infinity }}
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                fill="url(#noise-pattern)"
                className="pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Simulated Hazards */}
          {reports.map((report) => {
            const x = MAP_WIDTH/2 + (report.lng - 77.5946) * 12000;
            const y = MAP_HEIGHT/2 - (report.lat - 12.9716) * 12000;
            return (
              <g key={report.id}>
                {/* Spectrum Heatmap for Critical */}
                {report.level === DamageLevel.CRITICAL && (
                  <motion.circle
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                    transition={{ duration: 4, repeat: Infinity }}
                    cx={x}
                    cy={y}
                    r="250"
                    fill="url(#spectrum-heatmap)"
                  />
                )}

                {/* Normal Heatmap Ring */}
                {report.level !== DamageLevel.CRITICAL && (
                  <motion.circle
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    cx={x}
                    cy={y}
                    r={report.level === DamageLevel.HIGH ? "180" : "100"}
                    fill={report.level === DamageLevel.HIGH ? "#f59e0b" : "#3b82f6"}
                  />
                )}
                
                {/* Core Point */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={report.level === DamageLevel.CRITICAL ? "#e11d48" : "#f59e0b"}
                  filter="url(#glow-effect)"
                />
              </g>
            );
          })}

          {/* Blocked Road Indicators (X markers) */}
          {blockedNodes.map((node, i) => (
            <g key={i}>
               <motion.circle 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 cx={node.x} cy={node.y} r="30" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,4"
               />
               <path d={`M ${node.x-10} ${node.y-10} L ${node.x+10} ${node.y+10} M ${node.x+10} ${node.y-10} L ${node.x-10} ${node.y+10}`} stroke="#f43f5e" strokeWidth="4" />
            </g>
          ))}

          {/* Detailed Multiple Simulated Routes */}
          {activeRoutes.map((route) => {
            const pathData = route.path.map((p, idx) => {
              const x = MAP_WIDTH/2 + (p.lng - 77.5946) * 12000;
              const y = MAP_HEIGHT/2 - (p.lat - 12.9716) * 12000;
              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');

            return (
              <g key={route.id}>
                {/* Tactical Path Shadow/Glow Background */}
                <path
                  d={pathData}
                  stroke={route.status === 'BLOCKED' ? "#ef4444" : getRouteColor(route.vehicleType)}
                  strokeWidth="12"
                  fill="none"
                  className="opacity-10"
                />

                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    stroke: route.status === 'BLOCKED' ? "#ef4444" : getRouteColor(route.vehicleType)
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d={pathData}
                  strokeWidth={route.vehicleType === VehicleType.DRONE ? "3" : "8"}
                  fill="none"
                  strokeDasharray={
                    route.status === 'BLOCKED' 
                      ? "4,12" 
                      : (route.vehicleType === VehicleType.DRONE ? "2,8" : "20,10")
                  }
                  filter="url(#glow-effect)"
                  className="opacity-100"
                />
                
                {/* Directional Segment Pulse Animation - only for active routes */}
                {route.status === 'ACTIVE' && (
                  <motion.path
                    animate={{ strokeDashoffset: -100 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    d={pathData}
                    stroke={getRouteColor(route.vehicleType)}
                    strokeWidth={route.vehicleType === VehicleType.DRONE ? "1" : "3"}
                    fill="none"
                    strokeDasharray="40,260"
                    className="opacity-80"
                    filter="url(#glow-effect)"
                  />
                )}

                {/* Highlight waypoints on the path */}
                {route.path.map((p, idx) => {
                  const x = MAP_WIDTH/2 + (p.lng - 77.5946) * 12000;
                  const y = MAP_HEIGHT/2 - (p.lat - 12.9716) * 12000;
                  return (
                    <circle 
                      key={idx} 
                      cx={x} cy={y} 
                      r={route.vehicleType === VehicleType.DRONE ? "2" : "4"} 
                      fill="white" 
                      className="opacity-40" 
                    />
                  );
                })}

                {/* High-tech Scanning Pulse */}
                {route.status === 'ACTIVE' && (
                  <motion.path
                    animate={{ strokeDashoffset: [-200, 200] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    d={pathData}
                    stroke="#ffffff"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="2, 40"
                    className="opacity-100"
                  />
                )}

                {/* Animated Vehicle Icon Indicator */}
                {route.path.length > 0 && (
                  <motion.g
                    animate={{ 
                      x: [0, 2, -2, 0],
                      y: [0, -2, 2, 0],
                      scale: route.status === 'BLOCKED' ? 1.2 : 1
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <circle
                       cx={MAP_WIDTH/2 + (route.path[route.path.length - 1].lng - 77.5946) * 12000}
                       cy={MAP_HEIGHT/2 - (route.path[route.path.length - 1].lat - 12.9716) * 12000}
                       r={route.status === 'BLOCKED' ? "14" : "12"}
                       fill={route.status === 'BLOCKED' ? "#ef4444" : getRouteColor(route.vehicleType)}
                       className="shadow-2xl"
                    />
                    {route.status === 'ACTIVE' && (
                      <circle
                         cx={MAP_WIDTH/2 + (route.path[route.path.length - 1].lng - 77.5946) * 12000}
                         cy={MAP_HEIGHT/2 - (route.path[route.path.length - 1].lat - 12.9716) * 12000}
                         r="18"
                         fill="none"
                         stroke={getRouteColor(route.vehicleType)}
                         strokeWidth="2"
                         className="animate-ping opacity-30"
                      />
                    )}
                    {route.status === 'BLOCKED' && (
                      <g transform={`translate(${MAP_WIDTH/2 + (route.path[route.path.length - 1].lng - 77.5946) * 12000 - 8}, ${MAP_HEIGHT/2 - (route.path[route.path.length - 1].lat - 12.9716) * 12000 - 8})`}>
                         <AlertCircle className="text-white h-4 w-4" />
                      </g>
                    )}
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>

        {/* HUD Overlay: Legend & Metadata */}
        <div className="absolute top-24 left-8 pointer-events-none space-y-4">
           {/* Map Legend */}
           <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 backdrop-blur-md shadow-2xl space-y-3 w-40">
              <h4 className="text-[10px] font-black uppercase text-white tracking-widest border-b border-zinc-800 pb-2">Legend</h4>
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 bg-rose-500 rounded-full" />
                    <span className="text-[9px] font-bold text-zinc-400">AMBULANCE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 bg-amber-500 rounded-full" />
                    <span className="text-[9px] font-bold text-zinc-400">TRUCK ROUTE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 bg-blue-500 rounded-full" />
                    <span className="text-[9px] font-bold text-zinc-400">DRONE VECTOR</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="flex h-3 w-3 items-center justify-center">
                       <div className="h-px w-3 bg-rose-600 rotate-45 absolute" />
                       <div className="h-px w-3 bg-rose-600 -rotate-45 absolute" />
                    </div>
                    <span className="text-[9px] font-bold text-rose-500">BLOCKED RD</span>
                 </div>
              </div>
           </div>

           {/* Compass Overlay */}
           <div className="flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-2 backdrop-blur-md shadow-lg">
              <div className="flex flex-col items-center">
                 <div className="text-[8px] font-black text-rose-500">N</div>
                 <div className="h-6 w-px bg-zinc-800" />
                 <div className="text-[8px] font-black text-zinc-700">S</div>
              </div>
              <div className="text-[9px] font-mono text-zinc-400">
                HDG: 042° <br/>
                SPD: 0.0 KTS
              </div>
           </div>
        </div>

        {/* HUD Markers (HTML Overlay) */}
        <div className="absolute inset-0 pointer-events-none">
           {reports.map((report) => {
             const x = 50 + (report.lng - 77.5946) * 600;
             const y = 50 - (report.lat - 12.9716) * 600;
             return (
               <div 
                 key={report.id}
                 className="absolute"
                 style={{
                   left: `${x}%`,
                   top: `${y}%`,
                 }}
               >
                  <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                     <div className={cn(
                       "h-3 w-3 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]",
                       report.level === DamageLevel.CRITICAL ? "bg-rose-500" : report.level === DamageLevel.HIGH ? "bg-amber-500" : "bg-blue-500"
                     )} />
                     <div className="mt-2 flex flex-col items-center gap-1 scale-90">
                        <div className="rounded-sm bg-zinc-950/90 px-1.5 py-0.5 border border-zinc-800 backdrop-blur-md">
                           <span className="text-[7px] font-mono font-black text-white uppercase tracking-tighter">{report.type}</span>
                        </div>
                        <div className="h-4 w-px bg-zinc-800" />
                        <div className="text-[6px] font-mono text-zinc-500 bg-zinc-950/40 px-1">
                          CF: {(report.confidence * 100).toFixed(0)}%
                        </div>
                     </div>
                  </div>
               </div>
             );
           })}

           {/* Blocked Road Tooltips */}
           {blockedNodes.map((node, i) => {
             const x = (node.x / MAP_WIDTH) * 100;
             const y = (node.y / MAP_HEIGHT) * 100;
             return (
               <div 
                  key={i} 
                  className="absolute" 
                  style={{ left: `${x}%`, top: `${y}%` }}
               >
                  <div className="bg-rose-500/10 border border-rose-500/40 backdrop-blur-md px-1.5 py-0.5 rounded -translate-x-1/2 -translate-y-[40px]">
                    <span className="text-[7px] font-black text-rose-500 uppercase">{node.label}</span>
                  </div>
               </div>
             );
           })}
        </div>

        {/* Map Compass / Coordinates HUD */}
        <div className="absolute bottom-6 left-8 flex flex-col gap-1 font-mono text-[10px] text-zinc-500">
           <div className="flex items-center gap-2">
             <span className="text-amber-500 font-bold">LAT:</span>
             <span>12.9716° N</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-amber-500 font-bold">LNG:</span>
             <span>77.5946° E</span>
           </div>
           <div className="mt-2 h-[1px] w-24 bg-zinc-800" />
           <span className="text-[8px] uppercase tracking-tighter">Simulation Active - Sandbox v3.0</span>
        </div>
      </div>
    </div>
  );
}
