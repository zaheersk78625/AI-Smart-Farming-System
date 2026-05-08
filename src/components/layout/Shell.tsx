import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  Droplets, 
  CloudSun, 
  Microscope, 
  MessageSquare, 
  Settings, 
  Bell, 
  Menu, 
  X,
  TrendingUp,
  FlaskConical,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, children, onClick }: { to: string, icon: any, children: React.ReactNode, onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      isActive 
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
    )}
  >
    <Icon className={cn(
      "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
      "text-inherit"
    )} />
    <span className="font-medium">{children}</span>
  </NavLink>
);

export default function Shell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logOut } = useAuth();

  const userInitials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 leading-tight">AgroSmart</h1>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">AI Systems</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <SidebarItem to="/" icon={LayoutDashboard} onClick={() => setIsSidebarOpen(false)}>Dashboard</SidebarItem>
            <SidebarItem to="/prediction" icon={TrendingUp} onClick={() => setIsSidebarOpen(false)}>Crop Prediction</SidebarItem>
            <SidebarItem to="/soil" icon={FlaskConical} onClick={() => setIsSidebarOpen(false)}>Soil Analysis</SidebarItem>
            <SidebarItem to="/weather" icon={CloudSun} onClick={() => setIsSidebarOpen(false)}>Weather</SidebarItem>
            <SidebarItem to="/irrigation" icon={Droplets} onClick={() => setIsSidebarOpen(false)}>Irrigation</SidebarItem>
            <SidebarItem to="/disease" icon={Microscope} onClick={() => setIsSidebarOpen(false)}>Disease Lab</SidebarItem>
            <SidebarItem to="/notifications" icon={Bell} onClick={() => setIsSidebarOpen(false)}>Alerts Center</SidebarItem>
            <SidebarItem to="/assistant" icon={MessageSquare} onClick={() => setIsSidebarOpen(false)}>AI Assistant</SidebarItem>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <SidebarItem to="/admin" icon={Settings} onClick={() => setIsSidebarOpen(false)}>Admin Panel</SidebarItem>
            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl">
              <p className="text-xs font-semibold text-emerald-800 uppercase mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-700 font-medium">All Sensors Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-bottom border-slate-200 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:text-emerald-600 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={logOut}
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.displayName || 'User'}</p>
                <p className="text-xs text-slate-500 font-medium">Head Farmer</p>
              </div>
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border-2 border-emerald-50 object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-emerald-50 text-xs">
                  {userInitials}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
