// Service to handle data persistence
// In a real app, this would connect to Firebase Firestore

let detections = [];
let sensorLogs = [];

const MAX_HISTORY = 100;

const addDetection = (detection) => {
    detections.unshift(detection);
    if (detections.length > MAX_HISTORY) detections.pop();
    return detection;
};

const getDetections = () => {
    return detections;
};

const addSensorLog = (log) => {
    sensorLogs.unshift(log);
    if (sensorLogs.length > MAX_HISTORY) sensorLogs.pop();
    return log;
};

const getSensorLogs = () => {
    return sensorLogs;
};

const getStats = () => {
    const counts = {};
    detections.forEach(d => {
        counts[d.animal] = (counts[d.animal] || 0) + 1;
    });
    
    return {
        totalDetections: detections.length,
        animalCounts: counts,
        lastUpdate: new Date().toISOString()
    };
};

module.exports = {
    addDetection,
    getDetections,
    addSensorLog,
    getSensorLogs,
    getStats
};
