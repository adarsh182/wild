const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { getSensorData } = require('./simulators/sensorSimulator');
const { getDetection } = require('./simulators/detectionSimulator');
const dataService = require('./services/dataService');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// API Endpoints
app.get('/api/history', (req, res) => {
    res.json(dataService.getDetections());
});

app.get('/api/stats', (req, res) => {
    res.json(dataService.getStats());
});

app.get('/api/sensors', (req, res) => {
    res.json(dataService.getSensorLogs());
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send immediate initial state
    socket.emit('initial-data', {
        detections: dataService.getDetections(),
        sensors: dataService.getSensorLogs()
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Simulation Loops
// 1. Environmental Sensors (Every 2 seconds)
setInterval(() => {
    const data = getSensorData();
    dataService.addSensorLog(data);
    io.emit('sensor-update', data);
    
    if (data.status === 'CRITICAL') {
        io.emit('alert', {
            type: 'ENVIRONMENT',
            message: `Critical Environment Alert: ${data.smokeDetected ? 'SMOKE' : 'HEAT'} Detected!`,
            data: data
        });
    }
}, 2000);

// 2. Wildlife Detection (Random intervals 3-8 seconds)
const scheduleNextDetection = () => {
    const delay = Math.random() * 5000 + 3000;
    setTimeout(() => {
        const detection = getDetection();
        dataService.addDetection(detection);
        io.emit('detection', detection);
        
        if (detection.riskLevel === 'CRITICAL' || detection.riskLevel === 'High') {
            io.emit('alert', {
                type: 'WILDLIFE',
                message: `${detection.animal} detected in ${detection.zone}!`,
                data: detection
            });
        }
        
        scheduleNextDetection();
    }, delay);
};
scheduleNextDetection();

server.listen(PORT, () => {
  console.log(`SERVER RUNNING on port ${PORT}`);
});
