import React from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import LiveFeed from './components/LiveFeed';
import SensorPanel from './components/SensorPanel';
import { useSocket } from './hooks/useSocket';
import { AlertTriangle, X } from 'lucide-react';

function App() {
  const { isConnected, detections, sensorData, alerts } = useSocket();
  const [activeAlert, setActiveAlert] = React.useState(null);
  const [appLoaded, setAppLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate initial load delay for smooth appearance
    const timer = setTimeout(() => setAppLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (alerts.length > 0) {
        // Show the most recent alert
        setActiveAlert(alerts[0]);
        // Auto dismiss after 5 seconds
        const timer = setTimeout(() => setActiveAlert(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden flex flex-col transition-opacity duration-500 ${appLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header status={isConnected ? 'connected' : 'disconnected'} />
      
      {/* Main Dashboard Grid */}
      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden h-full">
        
        {/* Left Column: Feed & Sensors */}
        <div className="md:col-span-1 flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-none">
            <SensorPanel data={sensorData} />
          </div>
          <div className="flex-1 overflow-hidden">
            <LiveFeed detections={detections} />
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="md:col-span-3 bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden shadow-lg">
            <MapComponent detections={detections} />
            
            {/* Map Overlay Stats - with smooth transition */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-600 transition-all duration-300 hover:bg-slate-900/90">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Active Zones</h3>
                <div className="text-xl font-bold text-white">{new Set(detections.map(d => d.zone)).size} <span className="text-xs text-slate-500 font-normal">/ 4</span></div>
            </div>
            
             <div className="absolute top-4 right-32 bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-600 transition-all duration-300 hover:bg-slate-900/90">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Total Sightings</h3>
                <div className="text-xl font-bold text-white">{detections.length}</div>
            </div>
        </div>

      </main>

      {/* Floating Alert Toast */}
      {activeAlert && (
          <div className="fixed bottom-10 right-10 bg-red-600 text-white p-4 rounded-lg shadow-2xl border-2 border-red-400 flex items-start gap-3 max-w-sm z-50 animate-in slide-in-from-right duration-300">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                  <h4 className="font-bold text-lg uppercase tracking-wide">SYSTEM ALERT</h4>
                  <p className="text-sm opacity-90">{activeAlert.message}</p>
              </div>
              <button onClick={() => setActiveAlert(null)} className="ml-2 hover:bg-red-700 rounded p-1"><X className="w-4 h-4" /></button>
          </div>
      )}
    </div>
  );
}

export default App;
