import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  ShieldAlert,
  BellRing,
  Settings,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function NotificationSettings() {
  const { user, requestNotificationPermission } = useAuth();
  const [prefs, setPrefs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (user) {
      fetchPrefs();
    }
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [user]);

  const fetchPrefs = async () => {
    try {
      const userRef = doc(db, 'users', user!.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setPrefs(snap.data().notificationPrefs || { push: true, email: true, sms: false });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePref = async (key: string) => {
    if (!prefs) return;
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, { notificationPrefs: newPrefs });
    } finally {
      setSaving(false);
    }
  };

  const handleEnablePush = async () => {
    await requestNotificationPermission();
    setPermissionStatus(Notification.permission);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading settings...</div>;

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Notification Center</h2>
        <p className="text-slate-500 font-medium tracking-tight">Manage how and when you receive farming alerts</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Permission Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-emerald-600" />
              Push Status
            </h3>
            
            <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${
              permissionStatus === 'granted' ? 'bg-emerald-50 text-emerald-700' :
              permissionStatus === 'denied' ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {permissionStatus === 'granted' ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : 
               permissionStatus === 'denied' ? <AlertCircle className="w-5 h-5 mt-0.5" /> : 
               <Bell className="w-5 h-5 mt-0.5" />}
              <div>
                <p className="font-bold text-sm">
                  {permissionStatus === 'granted' ? 'Notifications Enabled' : 
                   permissionStatus === 'denied' ? 'Notifications Blocked' : 
                   'Ready to Connect'}
                </p>
                <p className="text-xs opacity-80 mt-1">
                  {permissionStatus === 'granted' ? 'Receiving real-time field alerts.' : 
                   permissionStatus === 'denied' ? 'Please enable in browser settings.' : 
                   'Enable to get instant updates on crop health.'}
                </p>
              </div>
            </div>

            {permissionStatus !== 'granted' && (
              <button 
                onClick={handleEnablePush}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
              >
                Enable Push Notifications
              </button>
            )}
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <ShieldAlert className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Critical Alerts</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Emergency frost or drought warnings go to all channels automatically.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Preferences */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Alert Channels
          </h3>

          <div className="space-y-4">
            {[
              { id: 'push', name: 'Browser Push Notifications', icon: Smartphone, desc: 'Real-time alerts via Firebase Cloud Messaging' },
              { id: 'email', name: 'Email Updates', icon: Mail, desc: 'Weekly reports and critical system logs' },
              { id: 'sms', name: 'SMS Alerts', icon: MessageSquare, desc: 'Instant text alerts for remote field monitoring' }
            ].map((channel) => (
              <div 
                key={channel.id}
                className="group flex items-center justify-between p-6 rounded-3xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/10 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{channel.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{channel.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => togglePref(channel.id)}
                  disabled={saving}
                  className={`w-14 h-8 rounded-full relative transition-colors ${prefs[channel.id] ? 'bg-emerald-600' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: prefs[channel.id] ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">
              Alerts are synced across all your connected devices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
