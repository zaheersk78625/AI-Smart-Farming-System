import React from 'react';
import { 
  FlaskConical, 
  Droplets, 
  Wind, 
  Activity, 
  ArrowUpRight, 
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { cn } from '../../lib/utils';

const soilData = [
  { subject: 'Nitrogen (N)', A: 85, fullMark: 100 },
  { subject: 'Phosphorus (P)', A: 65, fullMark: 100 },
  { subject: 'Potassium (K)', A: 90, fullMark: 100 },
  { subject: 'Moisture', A: 42, fullMark: 100 },
  { subject: 'pH Level', A: 75, fullMark: 100 },
  { subject: 'Organic Matter', A: 55, fullMark: 100 },
];

const nutrientDiff = [
  { name: 'N', current: 85, target: 100 },
  { name: 'P', current: 65, target: 100 },
  { name: 'K', current: 90, target: 100 },
  { name: 'pH', current: 6.5, target: 7.0 },
];

export default function SoilAnalysis() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Soil Health Analysis</h2>
          <p className="text-slate-500 font-medium tracking-tight">Comprehensive biochemical profile of your farmland</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm col-span-1 flex flex-col">
          <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" /> Nutrient Balance
          </h3>
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={soilData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name="Current Batch"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Score</p>
              <h4 className="text-2xl font-black text-emerald-600 tracking-tighter">78/100</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Healthy</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-6">Nutrient Deficiency Gaps</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutrientDiff}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="current" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-bold text-amber-900">Phosphorus Deficiency</h4>
              </div>
              <p className="text-sm text-amber-800/80 font-medium leading-relaxed">
                Current P-levels are 15% below target. This may affect root development and early growth in Rice crops. 
                <span className="block mt-2 font-bold text-amber-900 underline cursor-pointer">Suggest P-heavy fertilizer mix</span>
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-emerald-900">Optimal Nitrogen</h4>
              </div>
              <p className="text-sm text-emerald-800/80 font-medium leading-relaxed">
                N-levels are in the perfect range for the current growth stage. Vegetative development is progressing exceptionally well.
                <span className="block mt-2 font-bold text-emerald-900">No adjustment needed</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
