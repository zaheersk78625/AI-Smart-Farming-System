import React, { useEffect, useState } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  CloudRain, 
  CloudLightning,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function WeatherView() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation failed, using default coordinates", error);
          setLocationError("Using default location (New Delhi)");
          fetchWeather(28.6139, 77.2090);
        }
      );
    } else {
      fetchWeather(28.6139, 77.2090);
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><CloudSun className="w-10 h-10 animate-bounce text-emerald-300" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Weather Forecast</h2>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{weather?.name || 'Local Area'}, {weather?.sys?.country || ''}</span>
            </div>
            {locationError && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">{locationError}</span>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4 py-1.5 bg-slate-100 rounded-full">
            Updated just now
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider mb-6">Current Conditions</span>
                <div className="flex items-center gap-6 mb-4">
                  <Sun className="w-20 h-20 text-yellow-300 drop-shadow-2xl" />
                  <div>
                    <h3 className="text-7xl font-black tracking-tighter leading-none">{Math.round(weather?.main?.temp || 28)}°</h3>
                    <p className="text-xl font-bold text-emerald-100 capitalize mt-2">{weather?.weather?.[0]?.description || 'clear sky'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 border-l border-white/20 pl-0 md:pl-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Humidity</p>
                  <p className="text-2xl font-bold">{weather?.main?.humidity || 65}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Wind Speed</p>
                  <p className="text-2xl font-bold">{weather?.wind?.speed || 4.2} km/h</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">UV Index</p>
                  <p className="text-2xl font-bold text-amber-300">High</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Precipitation</p>
                  <p className="text-2xl font-bold">2.4 mm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-8 flex items-center justify-between">
               Weekly Outlook
               <button className="text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline">
                 7-Day Graph <ArrowRight className="w-3 h-3" />
               </button>
            </h3>
            <div className="flex justify-between overflow-x-auto pb-4 gap-4 scrollbar-thin">
              {[
                { day: 'Mon', icon: Sun, temp: 31, color: 'text-yellow-500' },
                { day: 'Tue', icon: CloudSun, temp: 29, color: 'text-emerald-500' },
                { day: 'Wed', icon: CloudRain, temp: 24, color: 'text-blue-500' },
                { day: 'Thu', icon: CloudLightning, temp: 26, color: 'text-indigo-500' },
                { day: 'Fri', icon: Sun, temp: 30, color: 'text-yellow-500' },
                { day: 'Sat', icon: Sun, temp: 32, color: 'text-yellow-500' },
                { day: 'Sun', icon: CloudSun, temp: 29, color: 'text-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 min-w-[80px] p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.day}</p>
                  <div className={cn("p-3 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <p className="text-lg font-black text-slate-800 tracking-tighter">{item.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-100 p-8 rounded-[32px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="font-bold text-red-900">Extreme Heat Warning</h4>
            </div>
            <p className="text-sm text-red-800/80 font-medium leading-relaxed">
              Temperatures are expected to reach <span className="font-bold">42°C</span> on Sat-Sun. 
              Ensure double-cycle irrigation for deep-root crops from Friday morning.
            </p>
            <button className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all">
              Update Irrigation
            </button>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Farmer's Schedule
            </h4>
            <div className="space-y-4">
              {[
                { time: 'Tomorrow', task: 'Fertilizer prep', status: 'Optimal' },
                { time: 'Thu 14:00', task: 'Soil drainage check', status: 'Required' },
                { time: 'Weekly', task: 'Pest monitoring', status: 'Routine' }
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{task.time}</p>
                    <p className="text-sm font-bold text-slate-800">{task.task}</p>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1",
                    task.status === 'Optimal' ? "bg-emerald-100 text-emerald-700" : 
                    task.status === 'Required' ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"
                  )}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
