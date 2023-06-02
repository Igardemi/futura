const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

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

/**
 * Obtener el mayor score por ID
 * 
 *  */ 
app.get('/scores/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    connection.query('SELECT user_id, MAX(score) AS max_score FROM scores WHERE user_id = ? GROUP BY user_id', user_id, (err, rows) => {
      if (err) {
        console.error('Error al obtener el score: ', err);
        res.status(500).send('Error del servidor');
      } else {
        if (rows.length > 0) {
          res.json(rows[0]);
        } else {
            newUser = {
                "user_id": null,
                "max_score": 0
            };
          res.send(newUser);
          //crear usuario.
        }
      }
    });
  });
 
/**
 * guardar puntuacion
 * {"id":null,"user_id":1,"score":14}
 */
    app.post('/scores', (req, res) => {
        const nuevaPuntuacion = req.body;
        connection.query('INSERT INTO scores SET ?',nuevaPuntuacion, (err, result) => {
          if (err) {
            console.error('Error al crear el elemento: ', err);
            res.status(500).send('Error del servidor');
          } else {
            res.status(201).send('puntuacion guardada correctamente');
          }
        });
      });
  
  /**
   * lOCALIZAR O CREAR USER
   * {"name":"Pablo"}
   */
  app.post('/users', (req, res) => {
    const userName = req.body.name;
    
    connection.query('SELECT * FROM users WHERE name = ? LIMIT 1', [userName], (error, results)=>{
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
          }
        if (results.length === 0) {
            connection.query('INSERT INTO users SET id=null, name = ?', userName, (err, result) => {
                if (err) {
                  console.error('Error al crear el elemento: ', err);
                  res.status(500).send('Error del servidor');
                } else {
                    //devolver nuevo usuario.
                  res.json(result);
                }
              });
          }
          const usuario = results[0];
          res.json(usuario);
        })
    });


// Puerto de escucha
const port = 3000;
app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});