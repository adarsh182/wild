// Sensor state (persists across calls)
let sensorState = {
    temperature: 28,
    humidity: 60,
    soundLevel: 35,
    fireActive: false,
    fireCooldown: 0,
    fireDuration: 0
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const randomDrift = (range) => (Math.random() * range * 2 - range);

const getSensorData = () => {
    // Random environmental drift
    sensorState.temperature += randomDrift(0.3);
    sensorState.humidity += randomDrift(0.8);
    sensorState.soundLevel += randomDrift(2);

    // Fire trigger logic (more frequent)
    if (!sensorState.fireActive && sensorState.fireCooldown === 0 && Math.random() > 0.92) {
        sensorState.fireActive = true;
        sensorState.fireDuration = 5; // Fire lasts 5 cycles (~10 seconds)
    }

    // Fire behavior
    if (sensorState.fireActive) {
        sensorState.temperature += 2.5;     // Heat rises
        sensorState.humidity -= 3;          // Air dries
        sensorState.soundLevel += 10;        // Alarm / crackling
        sensorState.fireDuration--;

        // Fire ends after duration expires
        if (sensorState.fireDuration <= 0) {
            sensorState.fireActive = false;
            sensorState.fireCooldown = 10; // Prevent immediate retrigger
        }
    }

    // Cooldown handling
    if (sensorState.fireCooldown > 0) {
        sensorState.fireCooldown--;
    }

    // Clamp realistic ranges
    sensorState.temperature = clamp(sensorState.temperature, 20, 80);
    sensorState.humidity = clamp(sensorState.humidity, 20, 90);
    sensorState.soundLevel = clamp(sensorState.soundLevel, 25, 100);

    // Status logic
    let status = 'NORMAL';
    if (sensorState.temperature > 45 || sensorState.soundLevel > 80) {
        status = 'WARNING';
    }
    if (sensorState.fireActive) {
        status = 'CRITICAL';
    }

    return {
        timestamp: new Date().toISOString(),
        temperature: Number(sensorState.temperature.toFixed(1)),
        humidity: Number(sensorState.humidity.toFixed(1)),
        soundLevel: Math.round(sensorState.soundLevel),
        smokeDetected: sensorState.fireActive,
        status
    };
};

module.exports = { getSensorData };

