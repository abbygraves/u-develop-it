const mysql = require('mysql2');


// ⬇︎ CONNECT TO DATABASE
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password123',
    database: 'election'
  },
  // console.log('Connected to the election database.')
);



module.exports = db;