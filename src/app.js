const express = require("express");
const { initDb } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const metricsRoutes = require("./routes/metricsRoutes"); // 1. Importar ruta de métricas
const { metricsMiddleware } = require("./services/metricsService"); // 2. Importar middleware
require("dotenv").config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(metricsMiddleware); // 3. Registrar el middleware para medir tiempos HTTP

// Inicializar la base de datos
initDb();

// Definir rutas
app.use("/api/auth", authRoutes);
app.use("/metrics", metricsRoutes); // 4. Exponer endpoint de Prometheus

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
