import React from 'react';
import { Camera, AlertCircle } from 'lucide-react';

const LiveFeed = ({ detections }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 h-full flex flex-col border border-slate-700">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-blue-400" />
        Live Detection Feed
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar scroll-smooth">
        {detections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
              <Camera className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm font-medium">No detections yet</p>
            <p className="text-xs text-slate-600 mt-1">Waiting for activity...</p>
          </div>
        ) : (
          detections.map((d) => (
            <div key={d.id} className={`p-3 rounded-md border transition-all duration-200 ease-in-out transform hover:scale-102 ${d.riskLevel === 'CRITICAL' ? 'bg-red-900/20 border-red-500/50 hover:shadow-lg hover:shadow-red-500/20' : (d.riskLevel === 'High' ? 'bg-orange-900/20 border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20' : 'bg-slate-700/50 border-slate-600 hover:shadow-lg hover:shadow-slate-600/20')}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {d.animal}
                    {d.riskLevel === 'CRITICAL' && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
                  </h3>
                  <p className="text-xs text-slate-400">{d.zone}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${d.riskLevel === 'CRITICAL' ? 'bg-red-500 text-white' : (d.riskLevel === 'High' ? 'bg-orange-500 text-black' : 'bg-green-500 text-black')}`}>
                  {Math.round(d.confidence * 100)}%
                </span>
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-16 bg-slate-900 rounded overflow-hidden">
                    <img src={d.imageUrl} alt={d.animal} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 text-xs text-slate-300">
                   <p>Lat: {d.location.lat.toFixed(4)}</p>
                   <p>Lng: {d.location.lng.toFixed(4)}</p>
                   <p className="mt-1 text-slate-500">{new Date(d.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveFeed;
