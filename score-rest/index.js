const express = require('express');
const mysql = require('mysql');

const app = express();

// Configuración de la conexión con la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scoredb'
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Ruta de ejemplo que consulta datos desde la base de datos
app.get('/', (req, res) => {
  connection.query('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error al realizar la consulta: ', err);
      res.status(500).send('Error del servidor');
    } else {
      res.json(rows);
    }
  });
});

// Puerto de escucha
const port = 3000;
app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});