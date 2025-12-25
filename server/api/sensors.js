const { getSensorData } = require('../simulators/sensorSimulator');

module.exports = (req, res) => {
  const count = parseInt(req.query.count) || 5;
  const items = Array.from({ length: count }, () => getSensorData());
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=59');
  res.json(items);
};
