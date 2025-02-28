require('dotenv').config({ path: './backend/.env' }); // Asegúrate de que esto esté al principio de tu archivo
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware para parsear JSON y URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "frontend"
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Ruta para manejar el registro de usuarios
app.post('/register', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario es requerido' });
    }

    try {
        // Verificar si el usuario ya existe
        const [rows] = await pool.query('SELECT * FROM usersjuego WHERE nombre = ?', [username]);
        if (rows.length > 0) {
            return res.json({ success: false, message: 'El nombre de usuario ya existe' });
        }

        // Insertar el nuevo usuario en la base de datos
        await pool.query('INSERT INTO usersjuego (nombre) VALUES (?)', [username]);

        res.json({ success: true, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    }
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario es requerido' });
    }

    try {
        // Verificar si el usuario existe en la base de datos
        const [rows] = await pool.query('SELECT * FROM usersjuego WHERE nombre = ?', [username]);
        if (rows.length === 0) {
            return res.json({ success: false, message: 'El usuario no existe. Regístrate primero.' });
        }

        // Si el usuario existe, iniciar sesión
        res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    }
});

// Ruta para servir el archivo RegisterUsuario.html
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'RegisterUsuario.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/registro`);
});