import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// The hook supports two modes:
// - Local dev (localhost): uses Socket.IO to connect to a running backend at http://localhost:3000
// - Production (deployed): polls serverless REST endpoints under `/api/*` on the same origin

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [detections, setDetections] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    if (isLocal) {
      const SOCKET_URL = backendUrl;
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to backend via socket');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('initial-data', (data) => {
        setDetections(data.detections || []);
        if (data.sensors && data.sensors.length > 0) setSensorData(data.sensors[0]);
      });

      newSocket.on('detection', (detection) => {
        setDetections(prev => [detection, ...prev].slice(0, 50));
      });

      newSocket.on('sensor-update', (data) => setSensorData(data));

      newSocket.on('alert', (alert) => setAlerts(prev => [alert, ...prev].slice(0, 10)));

      return () => newSocket.close();
    }

    // Production / deployed: polling-based fallback to Render backend or same origin
    let mounted = true;
    const fetchAll = async () => {
      try {
        const baseUrl = isLocal ? backendUrl : window.location.origin;
        const [hRes, sRes] = await Promise.all([
          fetch(`${baseUrl}/api/history?count=50`),
          fetch(`${baseUrl}/api/sensors?count=1`)
        ]);

        if (!mounted) return;
        const hJson = await hRes.json();
        const sJson = await sRes.json();

        setDetections(hJson || []);
        setSensorData((sJson && sJson.length) ? sJson[0] : null);

        // Build alerts from detections / sensors
        const alertList = (hJson || []).filter(d => d.riskLevel === 'CRITICAL' || d.riskLevel === 'High')
          .map(d => ({ type: 'WILDLIFE', message: `${d.animal} detected in ${d.zone}!`, data: d }));

        if (sJson && sJson[0] && sJson[0].status === 'CRITICAL') {
          alertList.unshift({ type: 'ENVIRONMENT', message: 'Critical environment alert detected', data: sJson[0] });
        }

        setAlerts(alertList.slice(0, 10));
        setIsConnected(true);
      } catch (e) {
        console.error('Polling error', e);
        setIsConnected(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return { socket, isConnected, detections, sensorData, alerts };
};
