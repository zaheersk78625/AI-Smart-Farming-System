import React, { useState } from 'react';
import { 
  Droplets, 
  Activity, 
  Power, 
  Timer, 
  BarChart3, 
  CloudRain, 
  Waves, 
  History,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const waterUsageData = [
  { day: 'Mon', usage: 120 },
  { day: 'Tue', usage: 145 },
  { day: 'Wed', usage: 90 },
  { day: 'Thu', usage: 110 },
  { day: 'Fri', usage: 160 },
  { day: 'Sat', usage: 130 },
  { day: 'Sun', usage: 115 },
];

export default function IrrigationManagement() {
  const [isMotorOn, setIsMotorOn] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  const toggleMotor = () => {
    if (mode === 'manual') setIsMotorOn(!isMotorOn);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Irrigation</h2>
          <p className="text-slate-500 font-medium tracking-tight">Water usage optimization and remote hardware control</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setMode('auto')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              mode === 'auto' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-slate-500 hover:text-emerald-600"
            )}
          >
            AI Auto Mode
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              mode === 'manual' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-slate-500 hover:text-emerald-600"
            )}
          >
            Manual Control
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            {isMotorOn && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                className="absolute inset-0 bg-emerald-50/50 rounded-full"
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            )}
            
            <div className={cn(
              "relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500",
              isMotorOn ? "bg-emerald-600 text-white shadow-[0_0_40px_rgba(16,185,129,0.4)]" : "bg-slate-100 text-slate-400"
            )}>
              <Waves className={cn("w-12 h-12", isMotorOn && "animate-bounce")} />
            </div>
            
            <h3 className="relative z-10 text-2xl font-black text-slate-800 mb-2">Water Pump</h3>
            <p className="relative z-10 text-slate-500 font-medium mb-8">
              {isMotorOn ? "Active and Pressurized" : "Standby Mode"}
            </p>

            <button 
              disabled={mode === 'auto'}
              onClick={toggleMotor}
              className={cn(
                "relative z-10 w-full py-5 rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95",
                isMotorOn 
                  ? "bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100" 
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-100",
                mode === 'auto' && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              <Power className="w-6 h-6" />
              {isMotorOn ? "Stop Motor" : "Start Motor"}
            </button>

            {mode === 'auto' && (
              <p className="relative z-10 mt-6 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Managed by AgroSmart AI
              </p>
            )}
          </div>

          <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Droplets className="w-32 h-32" />
             </div>
             <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6">Real-time Reservoir</h4>
             <div className="flex items-baseline gap-2 mb-4">
               <span className="text-5xl font-black">74%</span>
               <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">Full</span>
             </div>
             <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-8">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '74%' }}
                 className="h-full bg-blue-500" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Water pH</p>
                  <p className="text-xl font-bold">6.8</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Used</p>
                  <p className="text-xl font-bold">12.4k L</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Consumption Analytics</h3>
                <p className="text-sm text-slate-500 font-medium">Daily water usage in Liters (L)</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold text-xs border border-emerald-100">
                <TrendingDown className="w-4 h-4" /> 12% Saving vs Prev Week
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterUsageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="usage" radius={[8, 8, 0, 0]}>
                    {waterUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#3b82f6' : '#94a3b8'} fillOpacity={0.4} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-600" /> Auto-Schedules
              </h4>
              <div className="space-y-3">
                {[
                  { time: '05:30 AM', duration: '20 min', label: 'Morning Mist', next: 'Tomorrow' },
                  { time: '06:00 PM', duration: '15 min', label: 'Sunset Soak', next: 'In 4 hours' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all cursor-pointer">
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{s.time}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">{s.duration}</p>
                      <p className="text-[10px] font-semibold text-slate-400 capitalize">{s.next}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-emerald-300 hover:text-emerald-600 transition-all">
                Add New Schedule
              </button>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-blue-100 rounded-xl">
                    <History className="w-5 h-5 text-blue-600" />
                   </div>
                   <h4 className="font-bold text-blue-900">Recent Logs</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'Auto-Irrigation', reason: 'Low Moisture (32%)', time: '2h ago' },
                    { action: 'Scheduled Soak', reason: 'System Timer', time: '8h ago' },
                    { action: 'Manual Override', reason: 'Zaheer S.', time: 'Yesterday' }
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-blue-900">{log.action}</p>
                        <p className="text-xs text-blue-700/70 font-medium">{log.reason}</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-8 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View Full Audit Path <Info className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
