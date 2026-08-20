const express = require("express");
const router = express.Router();
const {
  registrar,
  login,
  obtenerUsuario,
} = require("../controllers/authController");

router.post("/registro", registrar);
router.post("/login", login);
router.get("/usuario/:id", obtenerUsuario);

module.exports = router;
