const express = require("express");
const { initDb } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

// Inicializar la base de datos
initDb();

// Definir rutas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
