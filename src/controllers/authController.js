const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

// Registrar usuario
const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios." });
  }

  try {
    const existeUsuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );
    if (existeUsuario.rows.length > 0) {
      return res.status(400).json({ mensaje: "El email ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, created_at",
      [nombre, email, hashedPassword],
    );

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente.",
      usuario: nuevoUsuario.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor.", error: error.message });
  }
};

// Login de usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: "Email y contraseña requeridos." });
  }

  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );
    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const usuario = resultado.rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const { password: _, ...datosUsuario } = usuario;
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      usuario: datosUsuario,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor.", error: error.message });
  }
};

// Consultar usuario por ID
const obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, created_at FROM usuarios WHERE id = $1",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.status(200).json({ usuario: resultado.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor.", error: error.message });
  }
};

module.exports = { registrar, login, obtenerUsuario };
