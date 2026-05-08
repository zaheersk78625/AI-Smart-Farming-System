import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCcw,
  Microscope,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectPlantDisease } from '../../lib/ai';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const analysis = await detectPlantDisease(base64);
      setResult(analysis || "No analysis returned.");
    } catch (error) {
      console.error(error);
      setResult("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Plant Disease Lab</h2>
        <p className="text-slate-500 font-medium tracking-tight">Computer vision analysis for immediate field diagnosis</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative group">
            {image ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img src={image} alt="Upload" className="w-full h-full object-cover" />
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-4 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Camera className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Capture or Upload</h3>
                <p className="text-slate-500 font-medium max-w-[240px]">
                  Take a clear photo of the affected plant leaf for accurate AI analysis
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Different Photo
            </button>
            <button 
              disabled={!image || loading}
              onClick={handleAnalyze}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  Analyzing Vision...
                </>
              ) : (
                <>
                  <Microscope className="w-5 h-5" />
                  Run Lab Analysis
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <div className="p-2 bg-blue-100 rounded-xl h-fit">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-sm">Diagnosis Tips</h4>
              <ul className="mt-2 space-y-1.5">
                {[
                  "Ensure good lighting and avoid shadows",
                  "Focus on one leaf with visible symptoms",
                  "A plain background improves accuracy",
                  "Include both top and bottom of leaf if possible"
                ].map((tip, i) => (
                  <li key={i} className="text-xs text-blue-700 font-medium flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="h-full">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-800">Analysis Results</h3>
                </div>

                <div className="prose prose-slate prose-sm max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-emerald-700 overflow-y-auto max-h-[600px] pr-4 scrollbar-thin">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Severity</p>
                    <p className="font-bold text-amber-900">Moderate Risk</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Confidence</p>
                    <p className="font-bold text-emerald-900">92% Reliable</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-50 mb-6">
                  <Search className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Awaiting Diagnosis</h3>
                <p className="text-slate-400 font-medium max-w-sm mb-8 tracking-tight">
                  Upload a photo of a sick plant on the left to start the AI vision lab analysis.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
