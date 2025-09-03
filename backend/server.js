const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Cargar variables de entorno desde .env para desarrollo local
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// --- CONFIGURACIÓN DE MULTER (MANEJO DE ARCHIVOS) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    // Renombrar el archivo para evitar colisiones: timestamp + nombre original
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- MIDDLEWARE ---
const corsOptions = {
  origin: 'https://verum.com.co',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// --- RUTAS DE LA API ---

// Endpoint para recibir datos del formulario de asesoría
app.post('/asesoria', upload.single('Planos'), async (req, res) => {
  const {
    Nombres,
    Apellidos,
    Email,
    Telefono,
    'Tipo de Contacto': tipo_contacto,
    Constructora,
    Obra,
    Ciudad,
    'Otra Ciudad': otra_ciudad,
    Comentarios
  } = req.body;

  const planosPath = req.file ? req.file.path : null;

  try {
    const query = `
      INSERT INTO asesoria (nombres, apellidos, email, telefono, tipo_contacto, constructora, obra, ciudad, otra_ciudad, comentarios, planos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id;
    `;
    const values = [Nombres, Apellidos, Email, Telefono, tipo_contacto, Constructora, Obra, Ciudad, otra_ciudad, Comentarios, planosPath];
    
    const result = await pool.query(query, values);
    res.status(201).json({ message: `Solicitud de asesoría guardada con éxito. ID: ${result.rows[0].id}` });
  } catch (error) {
    console.error('Error al guardar la solicitud de asesoría:', error);
    res.status(500).json({ message: 'Error interno del servidor al guardar la asesoría.' });
  }
});


// Guardar o actualizar preferencias de suscripción
app.post('/suscripciones', async (req, res) => {
  const { email, canales } = req.body;

  if (!email || !canales) {
    return res.status(400).json({ message: 'Email y canales son requeridos.' });
  }

  try {
    const query = `
      INSERT INTO suscripciones (email, canales)
      VALUES ($1, $2)
      ON CONFLICT (email)
      DO UPDATE SET
        canales = EXCLUDED.canales,
        fecha_actualizacion = CURRENT_TIMESTAMP
      RETURNING id;
    `;
    const result = await pool.query(query, [email, JSON.stringify(canales)]);
    res.status(200).json({ message: `Preferencias guardadas. ID: ${result.rows[0].id}` });
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener preferencias de un email
app.get('/suscripciones/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const query = 'SELECT canales FROM suscripciones WHERE email = $1;';
    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'No se encontraron preferencias para este email.' });
    }
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- INICIAR SERVIDOR ---
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});