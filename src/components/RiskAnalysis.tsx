import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ShieldAlert, Users, Ambulance, Radio, Activity } from 'lucide-react';
import { DamageReport, DamageLevel } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface RiskAnalysisProps {
  reports: DamageReport[];
}

const RISK_DATA = [
  { name: 'Background', value: 179768, color: '#334155' },
  { name: 'Moderate Risk', value: 76148, color: '#f59e0b' },
  { name: 'High Damage Est.', value: 12400, color: '#f43f5e' },
  { name: 'Safe / Low Risk', value: 45000, color: '#10b981' },
];

const RESOURCE_DATA = [
  { name: 'Fire Units', count: 6, color: '#3b82f6' },
  { name: 'Personnel', count: 795, color: '#0ea5e9' },
  { name: 'Ambulances', count: 95, color: '#fda4af' },
  { name: 'Drones', count: 2, color: '#ef4444' },
];

export function RiskAnalysis({ reports }: RiskAnalysisProps) {
  // Dynamically calculate risk based on reports
  const criticalCount = reports.filter(r => r.level === DamageLevel.CRITICAL).length;
  const highCount = reports.filter(r => r.level === DamageLevel.HIGH).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
           <Activity className="h-4 w-4 text-rose-500" />
           <h2 className="text-sm font-black uppercase tracking-widest text-white">Impact Estimation</h2>
        </div>
        <div className="text-[10px] font-mono text-zinc-500">
          ALGORITHM: AEGIS-V4-DELTA
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Chart */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2">Estimated Risk Distribution</h3>
          <div className="h-[280px] w-full rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {RISK_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Total Points</span>
              <span className="text-xl font-black text-white">313,316</span>
            </div>

            {/* Custom Legend */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-2">
               {RISK_DATA.map((d) => (
                 <div key={d.name} className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                   <div className="flex flex-col">
                     <span className="text-[8px] font-bold text-zinc-300 uppercase leading-none">{d.name}</span>
                     <span className="text-[9px] font-mono text-zinc-500">{(d.value / 313316 * 100).toFixed(1)}%</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Projected Resource Needs */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2">Projected Resource Needs</h3>
          <div className="h-[280px] w-full rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={RESOURCE_DATA}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#71717a" 
                  fontSize={9} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {RESOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Personnel', value: '795', icon: Users, color: 'text-blue-500' },
          { label: 'Fire Units', value: '06', icon: ShieldAlert, color: 'text-rose-500' },
          { label: 'Ambulances', value: '95', icon: Ambulance, color: 'text-rose-400' },
          { label: 'Drones', value: '02', icon: Radio, color: 'text-zinc-400' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center gap-4"
          >
            <div className={cn("p-2 rounded-lg bg-zinc-900", stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{stat.label}</p>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
