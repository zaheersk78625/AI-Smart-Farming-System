import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Trash2, 
  Sparkles,
  Maximize2,
  Mic,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFarmerAssistantResponse } from '../../lib/ai';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

export default function ChatAssistant() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm AgroSmart AI, your expert farming assistant. How can I help you today? I can assist with crop selection, soil management, pest control, or irrigation scheduling." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await getFarmerAssistantResponse(userMessage, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you further?" }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-4">
      <header className="flex justify-between items-center bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 tracking-tight">AI Farmer Assistant</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Specialist</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
            <Languages className="w-5 h-5" />
          </button>
          <button onClick={clearChat} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4",
                  m.role === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  m.role === 'user' ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"
                )}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "max-w-[80%] px-5 py-4 rounded-3xl",
                  m.role === 'user' 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-emerald-50 text-slate-800 rounded-tl-none border border-emerald-100/50"
                )}>
                  <div className={cn(
                    "prose prose-sm max-w-none prose-p:leading-relaxed prose-p:font-medium font-medium",
                    m.role === 'user' ? "prose-invert" : "prose-slate"
                  )}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-emerald-50 text-slate-400 px-5 py-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Consulting Knowledge Base...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              "Best crop for clay soil?",
              "Tomato pest control",
              "Nitrogen-rich fertilizers",
              "Irrigation schedule for Rice"
            ].map((q, i) => (
              <button 
                key={i} 
                onClick={() => setInput(q)}
                className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-3 py-2 rounded-xl hover:border-emerald-300 hover:text-emerald-700 transition-all text-left truncate"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for advice on your crops, soil or weather..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-5 pr-12 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
