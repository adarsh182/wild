// Sensor state (persists across calls)
let sensorState = {
    temperature: 24,
    humidity: 55,
    soundLevel: 30,
    fireActive: false,
    fireCooldown: 0,
    fireDuration: 0
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const randomDrift = (range) => (Math.random() * range * 2 - range);

const getSensorData = () => {
    // Random environmental drift (smaller variations)
    sensorState.temperature += randomDrift(0.15);
    sensorState.humidity += randomDrift(0.4);
    sensorState.soundLevel += randomDrift(1);

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
    } else {
        // Cooling/recovery when fire is off: gradually return to baseline
        if (sensorState.temperature > 25) {
            sensorState.temperature -= 0.3;  // Cool down
        }
        if (sensorState.soundLevel > 32) {
            sensorState.soundLevel -= 0.5;   // Quiet down
        }
        if (sensorState.humidity < 55) {
            sensorState.humidity += 0.2;     // Humidity recovers
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
    if (sensorState.temperature > 50 || sensorState.soundLevel > 85) {
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

