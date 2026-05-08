import React, { useState } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FlaskConical,
  Droplets,
  Thermometer,
  Zap,
  RefreshCcw,
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictCrop } from '../../lib/ai';
import { PredictionResult } from '../../types';
import { cn } from '../../lib/utils';

export default function CropPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    temperature: 28,
    humidity: 70,
    ph: 6.5,
    rainfall: 150,
    soil_type: 'Loamy'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await predictCrop(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Crop Prediction</h2>
        <p className="text-slate-500 font-medium tracking-tight">Advanced machine learning model to optimize your yield</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-slate-800 mb-2">Input Soil Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                   Temperature <span className="text-emerald-600 lowercase">{formData.temperature}°C</span>
                </label>
                <input 
                  type="range" min="0" max="50" step="1"
                  className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                   Humidity <span className="text-emerald-600 lowercase">{formData.humidity}%</span>
                </label>
                <input 
                  type="range" min="0" max="100" step="1"
                  className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={formData.humidity}
                  onChange={(e) => setFormData({...formData, humidity: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                   Soil pH <span className="text-emerald-600 lowercase">{formData.ph}</span>
                </label>
                <input 
                  type="range" min="0" max="14" step="0.1"
                  className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={formData.ph}
                  onChange={(e) => setFormData({...formData, ph: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Soil Type</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={formData.soil_type}
                  onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                >
                  <option>Loamy</option>
                  <option>Sandy</option>
                  <option>Clay</option>
                  <option>Silt</option>
                  <option>Peaty</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                   Rainfall <span className="text-emerald-600 lowercase">{formData.rainfall}mm</span>
                </label>
                <input 
                  type="range" min="0" max="500" step="10"
                  className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({...formData, rainfall: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  Analyzing conditions...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Prediction
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-100">
                    <Sprout className="w-12 h-12 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide px-2 py-0.5 bg-emerald-50 rounded-md">Top Recommendation</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{Math.round(result.confidence * 100)}% Match</span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-slate-900 leading-tight">{result.recommended_crop}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-emerald-600" /> Reasoning
                    </h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {result.reasoning}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recommended Fertilizers
                    </h4>
                    <ul className="space-y-2">
                      {result.fertilizers.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-emerald-700 font-semibold group">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-150 transition-transform" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Agricultural Forecast</h4>
                      <p className="text-xs text-slate-400 font-medium">Potential ROI based on current market trends</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1 border-r border-slate-800">
                      <p className="text-2xl font-bold text-emerald-400">High</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Market Demand</p>
                    </div>
                    <div className="text-center flex-1 border-r border-slate-800">
                      <p className="text-2xl font-bold text-blue-400">140 Days</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Growth Period</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-amber-400">$3.2k/ha</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Est. Revenue</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-emerald-50/30 border-2 border-dashed border-emerald-100 rounded-3xl flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 mb-6">
                  <Search className="w-10 h-10 text-emerald-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Ready for analysis</h3>
                <p className="text-slate-500 font-medium max-w-sm mb-8 tracking-tight">
                  Fill in your soil parameters and environmental conditions to receive an AI-powered crop recommendation.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-emerald-50">
                    <FlaskConical className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Soil Labs</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-emerald-50">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase">IoT Ready</span>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
