import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const Header = ({ status }) => {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-lg border-b border-slate-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold tracking-wider">WILDLIFE GUARD <span className="text-xs font-normal text-slate-400">AI SYSTEM</span></h1>
            <p className="text-xs text-slate-400">Automated Monitoring & Protection</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${status === 'connected' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
            <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {status === 'connected' ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
