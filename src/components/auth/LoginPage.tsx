import React from 'react';
import { Sprout, LogIn, ChevronRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { signIn, isSigningIn } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-emerald-100 p-10 border border-slate-100"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 mb-6 rotate-3">
            <Sprout className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">AgroSmart AI</h1>
          <p className="text-slate-500 font-medium tracking-tight">The future of intelligent farming starts here</p>
        </div>

        <div className="space-y-4 mb-10">
          {[
            { icon: ShieldCheck, text: "Secure Field Diagnostics", color: "text-blue-500" },
            { icon: Zap, text: "Real-time IoT Insights", color: "text-amber-500" },
            { icon: Globe, text: "Global Crop Intelligence", color: "text-emerald-500" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-bold text-slate-700 tracking-tight">{item.text}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={signIn}
          disabled={isSigningIn}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <LogIn className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
          {isSigningIn ? 'Connecting...' : 'Continue with Google'}
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>

        <p className="mt-8 text-center text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
          By continuing, you agree to our <br />
          <span className="text-slate-600 underline cursor-pointer">Terms of Service</span> & <span className="text-slate-600 underline cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
