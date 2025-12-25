# System Architecture: WildlifeMonitorAI

## High-Level Architecture

```mermaid
graph TD
    User[User / Judge] -->|View Dashboard| Client[React Frontend (Vite)]
    Client -->|Socket.IO (Real-time)| Server[Node.js + Express Backend]
    Client -->|REST API (History/Stats)| Server
    Client -->|Google Maps API| GMaps[Google Maps]
    
    subgraph "Backend System"
        Server -->|Manage| DetectionSim[Detection Simulator (Mock AI)]
        Server -->|Manage| SensorSim[IoT Sensor Simulator]
        Server -->|Store| DB[(Data Service / Mock DB)]
    end
    
    DetectionSim -->|Emit Events| Server
    SensorSim -->|Emit Readings| Server
```

## Tech Stack Choices

| Component | Tech | Justification |
|-----------|------|---------------|
| **Frontend** | React + Vite | Modern, fast HMR, industry standard. |
| **Styling** | Tailwind CSS | Rapid UI development, clean look for hackathons. |
| **Maps** | Google Maps JS API | Best-in-class visualization for geospatial data. |
| **Real-time** | Socket.IO | Reliable event-based communication for instant alerts. |
| **Backend** | Node.js + Express | Lightweight, JavaScript everywhere, easy to demo. |
| **Database** | In-Memory (with Firebase Hooks) | Zero-setup for judges to run. Code includes structure for Firebase. |
| **Simulators** | Custom JS | Guarantees "wildlife" appearance during short demo windows. |

## Folder Structure

```
/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # UI Components (Map, Feed, Sensors)
│   │   ├── hooks/          # Custom Hooks (useSocket)
│   │   ├── App.jsx         # Main Dashboard Layout
│   │   └── main.jsx        # Entry Point
│   └── package.json
├── server/                 # Backend Application
│   ├── simulators/         # Mock Data Generators
│   │   ├── detection.js    # Generates animal sightings
│   │   └── sensors.js      # Generates IoT data
│   ├── services/           # Data Abstraction Layer
│   ├── index.js            # Server Entry Point
│   └── package.json
├── ARCHITECTURE.md         # System Design
├── HONESTY.md              # Hackathon Transparency
├── DEMO_FLOW.md            # Script for Judges
└── README.md               # Setup Instructions
```

## API Endpoints

### REST API

- `GET /api/history`
  - Returns recent detection history.
- `GET /api/stats`
  - Returns aggregate statistics (detections per zone, animal counts).
- `GET /api/status`
  - System health check.

### Socket.IO Events

- `detection`: Emitted when an animal is "spotted".
  - Payload: `{ id, animal, confidence, lat, lng, timestamp, imageUrl, zone }`
- `sensorUpdate`: Emitted every X seconds with environmental data.
  - Payload: `{ temp, humidity, soundLevel, fireRisk, timestamp }`
- `alert`: Emitted when critical thresholds are crossed (Fire, Poacher, etc).

## Database Schema (Concept)

### Collections

**Detections**
```json
{
  "id": "uuid",
  "animal": "Elephant",
  "confidence": 0.94,
  "location": { "lat": -1.2921, "lng": 36.8219 },
  "timestamp": "ISOString",
  "imageUrl": "https://...",
  "zone": "Zone A (River)"
}
```

**SensorLogs**
```json
{
  "id": "uuid",
  "sensorId": "IoT-01",
  "readings": {
    "temp": 28.5,
    "humidity": 60,
    "sound": 45
  },
  "timestamp": "ISOString"
}
```
