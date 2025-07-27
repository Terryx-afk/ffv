const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para enviar el formulario de contacto
app.post('/enviar-correo', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CORREO_EMISOR,
        pass: process.env.PASSWORD_CORREO
      }
    });

    const mailOptions = {
      from: process.env.CORREO_EMISOR,
      to: process.env.CORREO_RECEPTOR,
      subject: 'Nuevo mensaje desde tu sitio web',
      html: `
        <h3>Contacto desde tu página</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensaje: 'Correo enviado con éxito' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
