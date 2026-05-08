import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shell from './components/layout/Shell';
import Dashboard from './components/dashboard/Dashboard';
import CropPrediction from './components/dashboard/CropPrediction';
import SoilAnalysis from './components/dashboard/SoilAnalysis';
import WeatherView from './components/dashboard/WeatherView';
import IrrigationManagement from './components/dashboard/IrrigationManagement';
import DiseaseDetection from './components/dashboard/DiseaseDetection';
import ChatAssistant from './components/dashboard/ChatAssistant';
import NotificationSettings from './components/dashboard/NotificationSettings';
import AdminPanel from './components/dashboard/AdminPanel';
import LoginPage from './components/auth/LoginPage';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Shell /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="prediction" element={<CropPrediction />} />
          <Route path="soil" element={<SoilAnalysis />} />
          <Route path="weather" element={<WeatherView />} />
          <Route path="irrigation" element={<IrrigationManagement />} />
          <Route path="disease" element={<DiseaseDetection />} />
          <Route path="assistant" element={<ChatAssistant />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
