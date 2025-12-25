import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [detections, setDetections] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to backend');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('initial-data', (data) => {
        setDetections(data.detections);
        if (data.sensors && data.sensors.length > 0) {
            setSensorData(data.sensors[0]);
        }
    });

    newSocket.on('detection', (detection) => {
        setDetections(prev => [detection, ...prev].slice(0, 50));
    });

    newSocket.on('sensor-update', (data) => {
        setSensorData(data);
    });
    
    newSocket.on('alert', (alert) => {
        setAlerts(prev => [alert, ...prev].slice(0, 10));
        // Play sound or browser notification here
    });

    return () => newSocket.close();
  }, []);

  return { socket, isConnected, detections, sensorData, alerts };
};
