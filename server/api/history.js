const { getDetection } = require('../simulators/detectionSimulator');

module.exports = (req, res) => {
  const count = parseInt(req.query.count) || 20;
  const items = Array.from({ length: count }, () => getDetection());
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
  res.json(items);
};
