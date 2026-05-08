import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Settings, 
  Cpu, 
  Database, 
  ShieldCheck, 
  History,
  HardDrive,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminPanel() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Administration</h2>
        <p className="text-slate-500 font-medium tracking-tight">Core configuration, user management, and hardware diagnostics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Registered Farmers', value: '42', icon: Users, color: 'bg-indigo-500' },
          { label: 'Active Sensors', value: '156', icon: Cpu, color: 'bg-emerald-500' },
          { label: 'Database Health', value: '99.8%', icon: Database, color: 'bg-blue-500' },
          { label: 'Security Status', value: 'Protected', icon: ShieldCheck, color: 'bg-slate-800' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg", item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter mt-1">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-xl text-slate-800 mb-8">Recent System Logs</h3>
          <div className="space-y-4">
            {[
              { time: '10:42 AM', event: 'Backup completed successfully', type: 'success' },
              { time: '09:15 AM', event: 'Sensor S-124 recalibrated remotely', type: 'info' },
              { time: '08:00 AM', event: 'Daily analytics report generated', type: 'success' },
              { time: 'Yesterday', event: 'New farmer Zohan joined the network', type: 'info' },
              { time: 'Yesterday', event: 'Hardware Update v2.4 deployed', type: 'warning' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    log.type === 'success' ? "bg-emerald-500" : log.type === 'warning' ? "bg-amber-500" : "bg-blue-500"
                  )} />
                  <p className="text-sm font-bold text-slate-700">{log.event}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" /> Storage Capacity
            </h4>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    <span>Main DB</span>
                    <span className="text-emerald-600">324MB / 1GB</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[32%]" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    <span>Image Store</span>
                    <span className="text-blue-600">14GB / 50GB</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[28%]" />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white">
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Server Performance
            </h4>
            <div className="flex justify-between items-end gap-2 h-24">
              {[40, 60, 35, 80, 50, 45, 90, 70, 55, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative group cursor-pointer overflow-hidden">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500 transition-all group-hover:bg-emerald-400" 
                   />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CPU Load: 42%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RAM: 1.2GB/4GB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
