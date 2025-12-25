// Generates mock wildlife sightings

const ANIMALS = [
    { name: 'Elephant', risk: 'Low', speed: 'Slow' },
    { name: 'Lion', risk: 'High', speed: 'Fast' },
    { name: 'Rhino', risk: 'Medium', speed: 'Slow' },
    { name: 'Zebra', risk: 'Low', speed: 'Medium' },
    { name: 'Poacher', risk: 'CRITICAL', speed: 'Fast' } // Security alert
];

// Center point (e.g., a park in Kenya)
const CENTER_LAT = -1.2921;
const CENTER_LNG = 36.8219;
const RADIUS = 0.02; // Roughly 2km

const getDetection = () => {
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    
    // Random position within radius
    const lat = CENTER_LAT + (Math.random() * RADIUS * 2 - RADIUS);
    const lng = CENTER_LNG + (Math.random() * RADIUS * 2 - RADIUS);
    
    // Determine zone based on logic (simple quadrants for demo)
    const zone = lat > CENTER_LAT ? (lng > CENTER_LNG ? 'North-East' : 'North-West') : (lng > CENTER_LNG ? 'South-East' : 'South-West');
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        animal: animal.name,
        confidence: parseFloat((0.75 + Math.random() * 0.24).toFixed(2)), // 0.75 - 0.99
        location: { lat, lng },
        zone: zone,
        riskLevel: animal.risk,
        timestamp: new Date().toISOString(),
        // Placeholder images for demo visualization
        imageUrl: `https://source.unsplash.com/400x300/?${animal.name.toLowerCase()}` 
    };
};

module.exports = { getDetection };
