const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Beautiful#3",
    database: 'users'
  });
  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to SQL database!");
  });
  module.exports = db;