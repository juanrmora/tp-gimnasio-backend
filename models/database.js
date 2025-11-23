const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost',     // Tu servidor local
  user: 'root',          // Usuario por defecto (común en XAMPP)
  password: '',          // Contraseña (suele ser vacía en local)
  database: 'gimnasio'   // El nombre de la base de datos que usaremos
});

// Probar la conexión
connection.connect((error) => {
  if (error) {
    console.error('Error de conexión: ' + error.stack);
    return;
  }
  console.log('¡Conexión exitosa a la base de datos del Gimnasio!');
});

// Exportar la conexión para usarla en otros archivos
module.exports = connection;
