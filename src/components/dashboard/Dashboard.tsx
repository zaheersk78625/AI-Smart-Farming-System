import React, { useEffect, useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  Wind, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  Activity,
  Bell,
  MapPin,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { SensorData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const mockData = [
  { time: '08:00', moisture: 45, temp: 24, humidity: 62 },
  { time: '10:00', moisture: 42, temp: 26, humidity: 58 },
  { time: '12:00', moisture: 38, temp: 29, humidity: 52 },
  { time: '14:00', moisture: 35, temp: 31, humidity: 48 },
  { time: '16:00', moisture: 40, temp: 28, humidity: 55 },
  { time: '18:00', moisture: 44, temp: 25, humidity: 60 },
  { time: '20:00', moisture: 48, temp: 23, humidity: 65 },
];

const StatCard = ({ title, value, unit, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <div className="flex items-baseline gap-1 mt-1">
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <span className="text-slate-400 font-semibold text-sm">{unit}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, requestNotificationPermission } = useAuth();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [sensors, setSensors] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationName, setLocationName] = useState('Detecting location...');

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShowNotificationPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Geolocation for Dashboard Header
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          setLocationName(data.address.city || data.address.town || data.address.village || 'Your Farm');
        } catch (e) {
          setLocationName('Agri Zone');
        }
      });
    }

    // Real-time Firestore Listener
    const q = query(
      collection(db, 'sensor_data'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSensors(data);
    });

    return () => unsubscribe();
  }, []);

  const simulateData = async () => {
    setIsRefreshing(true);
    try {
      const readings = [
        { sensorType: 'moisture', value: Math.floor(Math.random() * 20) + 35, unit: '%' },
        { sensorType: 'temperature', value: Math.floor(Math.random() * 10) + 25, unit: '°C' },
        { sensorType: 'humidity', value: Math.floor(Math.random() * 20) + 50, unit: '%' }
      ];

      for (const r of readings) {
        await addDoc(collection(db, 'sensor_data'), {
          ...r,
          timestamp: serverTimestamp()
        });
      }
    } catch (e) {
      console.error("Simulation failed", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const getLatestValue = (type: string, fallback: string) => {
    const sensor = sensors.find(s => s.sensorType === type);
    return sensor ? sensor.value : fallback;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Notification Prompt */}
      <AnimatePresence>
        {showNotificationPrompt && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 text-white p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform">
              <Bell className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg">Never miss a critical field alert</h3>
                <p className="text-slate-400 text-sm font-medium tracking-tight">Enable push notifications to receive instant updates on soil health and irrigation needs.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-center">
              <button 
                onClick={() => setShowNotificationPrompt(false)}
                className="px-6 py-4 text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Dismiss
              </button>
              <button 
                onClick={() => {
                  requestNotificationPermission();
                  setShowNotificationPrompt(false);
                }}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
              >
                Enable Alerts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold tracking-tight uppercase">{locationName}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Farm Overview</h2>
          <p className="text-slate-500 font-medium italic">"Real-time intelligence for smarter agriculture"</p>
        </div>
        <button 
          onClick={simulateData}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl text-sm font-black hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          Live Simulation
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Soil Moisture" 
          value={getLatestValue('moisture', '42')} 
          unit="%" 
          trend={-2.4} 
          icon={Droplets} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Air Temperature" 
          value={getLatestValue('temperature', '28.4')} 
          unit="°C" 
          trend={1.2} 
          icon={Thermometer} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Humidity" 
          value={getLatestValue('humidity', '55')} 
          unit="%" 
          icon={Wind} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Optimal Fertility" 
          value="Healthy" 
          unit="" 
          icon={Sprout} 
          color="bg-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-xl text-slate-800">Environmental Analytics</h3>
              <p className="text-sm text-slate-500 font-medium">Historical trends over the last 24 hours</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 px-3 py-1.5 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Moisture
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 px-3 py-1.5 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-orange-500" /> Temp
              </span>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="moisture" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMoisture)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full">
            <h3 className="font-bold text-xl text-slate-800 mb-6">AI Recommendations</h3>
            <div className="space-y-4">
              {[
                { 
                  type: 'warning', 
                  title: 'Irrigation Needed', 
                  desc: 'Soil moisture in Sector B-4 is dropping. Suggesting 20L spray.',
                  icon: Droplets,
                  color: 'text-amber-600 bg-amber-50'
                },
                { 
                  type: 'success', 
                  title: 'Optimal Growth', 
                  desc: 'Temperature and humidity levels are perfect for current Rice crop.',
                  icon: Sprout,
                  color: 'text-emerald-600 bg-emerald-50'
                },
                { 
                  type: 'info', 
                  title: 'Weather Alert', 
                  desc: 'Rain forecasted for tomorrow afternoon. Adjust fertilizer timing.',
                  icon: Wind,
                  color: 'text-blue-600 bg-blue-50'
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={cn("p-3 rounded-xl shrink-0 h-fit transition-transform group-hover:scale-110", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
