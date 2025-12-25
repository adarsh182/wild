import React from 'react';
import { Thermometer, Droplets, Volume2, Flame } from 'lucide-react';

const SensorCard = ({ icon: Icon, label, value, unit, alert }) => (
  <div className={`p-3 rounded-lg border ${alert ? 'bg-red-900/30 border-red-500 animate-pulse' : 'bg-slate-700/30 border-slate-600'} flex items-center justify-between`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${alert ? 'bg-red-500/20 text-red-400' : 'bg-slate-600/50 text-slate-300'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase font-semibold">{label}</p>
        <p className="text-lg font-bold text-white">{value}<span className="text-sm text-slate-500 ml-1">{unit}</span></p>
      </div>
    </div>
  </div>
);

const SensorPanel = ({ data }) => {
  if (!data) return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex items-center justify-center h-40">
      <div className="flex flex-col items-center gap-3">
        <div className="space-y-3 w-full">
          <div className="h-6 bg-slate-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const { temperature, humidity, soundLevel, smokeDetected } = data;
  const isAlert = data.status === 'CRITICAL';

  return (
    <div className={`bg-slate-800 rounded-lg p-4 border transition-all ${isAlert ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-slate-700'}`}>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isAlert ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
        Environmental Sensors
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <SensorCard 
            icon={Thermometer} 
            label="Temp" 
            value={temperature} 
            unit="°C" 
            alert={temperature > 40}
        />
        <SensorCard 
            icon={Droplets} 
            label="Humidity" 
            value={humidity} 
            unit="%" 
            alert={humidity < 20}
        />
        <SensorCard 
            icon={Volume2} 
            label="Acoustic" 
            value={Math.round(soundLevel)} 
            unit="dB" 
            alert={soundLevel > 80}
        />
        <SensorCard 
            icon={Flame} 
            label="Fire Risk" 
            value={smokeDetected ? "CRITICAL" : "SAFE"} 
            unit="" 
            alert={smokeDetected}
        />
      </div>
    </div>
  );
};

export default SensorPanel;
