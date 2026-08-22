const { register } = require("../services/metricsService");

const getMetrics = async (req, res) => {
  try {
    res.setHeader("Content-Type", register.contentType);
    res.send(await register.metrics());
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getMetrics,
};
