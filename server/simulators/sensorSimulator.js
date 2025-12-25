// Generates random environmental data

const getSensorData = () => {
    // Base values
    const baseTemp = 28;
    const baseHumidity = 60;
    
    // Add some noise
    const temp = baseTemp + (Math.random() * 4 - 2); // 26 - 30
    const humidity = baseHumidity + (Math.random() * 10 - 5); // 55 - 65
    
    // Occasional events
    const isFire = Math.random() > 0.99; // 1% chance of fire spike
    const isSoundSpike = Math.random() > 0.95; // 5% chance of sound spike
    
    return {
        timestamp: new Date().toISOString(),
        temperature: isFire ? (temp + 30) : parseFloat(temp.toFixed(1)), // Spike to 50+ if fire
        humidity: parseFloat(humidity.toFixed(1)),
        soundLevel: isSoundSpike ? (Math.random() * 40 + 60) : (Math.random() * 20 + 30), // Normal 30-50, Spike 60-100
        smokeDetected: isFire,
        status: isFire ? 'CRITICAL' : 'NORMAL'
    };
};

module.exports = { getSensorData };
