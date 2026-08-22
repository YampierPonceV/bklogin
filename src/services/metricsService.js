const client = require("prom-client");

// Crear un registro para las métricas
const register = new client.Registry();

// Habilitar recolección de métricas por defecto de Node.js (CPU, Memoria, Event Loop)
client.collectDefaultMetrics({ register });

// Métrica personalizada para peticiones HTTP
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de las peticiones HTTP en segundos",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5],
});

register.registerMetric(httpRequestDurationMicroseconds);

// Middleware para medir el tiempo de cada petición
const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
};

module.exports = {
  register,
  metricsMiddleware,
};
