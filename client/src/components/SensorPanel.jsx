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
  if (!data) return <div className="text-slate-500 text-sm">Waiting for sensors...</div>;

  const { temperature, humidity, soundLevel, smokeDetected } = data;

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
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
