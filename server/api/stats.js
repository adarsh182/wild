const { getDetection } = require('../simulators/detectionSimulator');

module.exports = (req, res) => {
  const count = parseInt(req.query.count) || 30;
  const detections = Array.from({ length: count }, () => getDetection());

  const counts = {};
  detections.forEach(d => {
    counts[d.animal] = (counts[d.animal] || 0) + 1;
  });

  const stats = {
    totalDetections: detections.length,
    animalCounts: counts,
    lastUpdate: new Date().toISOString()
  };

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
  res.json(stats);
};
