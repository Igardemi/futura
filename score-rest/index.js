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
          res.json(rows[0].max_score);
        } else {
          res.send('0');
        }
      }
    });
  });
 
/**
 * guardar puntuacion
 * {"user_id":1,"score":14}
 */
    app.post('/scores', (req, res) => {
        console.log(req.form);

        let user_id = req.body.user_id;
        let score = req.body.score;
        user_id=parseInt(user_id);
        score = parseInt(score);

        connection.query('INSERT INTO scores (id,user_id,score) VALUES (null, ?, ?)', [user_id, score], (err, result) => {
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
  app.get('/users/:userName', (req, res) => {
    const userName = req.params.userName;
    let user_id = null;
    
    connection.query('SELECT * FROM users WHERE name = ? LIMIT 1;', [userName], (error, results)=>{
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
          }
        if (results.length === 0) {
            
            connection.query('INSERT INTO users(name) VALUES (?)',[userName], (err, insertResult) => {
                if (err) {
                  console.error('Error al crear el elemento: ', err);
                  res.status(500).send('Error del servidor');
                }
                else{
                    connection.query('SELECT id FROM users ORDER BY id DESC LIMIT 1', (err, insert) => {
                        if (err) {
                          console.error('Error al crear el elemento: ', err);
                          res.status(500).send('Error del servidor');
                        }
                        res.json(insert[0].id);         
                    });  
                }               
            });
                   
        }
        else{  
            let usuario = results[0];
            res.json(usuario.id);
        }
        })
    });


// Puerto de escucha
const port = 3000;
app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});