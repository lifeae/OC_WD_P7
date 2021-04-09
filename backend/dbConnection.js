const mysql = require('mysql');
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'groupomania',
  connectionLimit: 10
})

dbConnection.connect(function(error) {
  if (error) throw error;
  else console.log(`Connected to the MySQL database!`);
});

module.exports = dbConnection;