const mysql = require('mysql2');
const express = require('express');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

// EXPRESS MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
  console.log('Connected to the election database.')
);

// ———————————————————————————————————————————————————————————————
// ░░░░░░░░░░ ROUTES/QUERIES ░░░░░░░░░░

// ⬇︎ GET ALL CANDIDATES
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


// ⬇︎ GET A SINGLE CANDIDATE
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});


// ⬇︎ DELETE A CANDIDATE
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'successfully deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


// ⬇︎ CREATE (POST) A CANDIDATE
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});





// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// ———————————————————————————————————————————————————————————————
// ░░░░░░░░░░ ROUTES ░░░░░░░░░░

// ⬇︎ DEFAULT RESPONSE FOR ANY OTHER REQUEST (NOT FOUND)
app.use((req, res) => {
  res.status(404).end();
});





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});