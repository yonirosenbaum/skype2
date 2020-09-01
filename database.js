const mysql = require('mysql');
const cleardb= 'CLEARDB_ONYX_URL: mysql://bcabfc9f759312:8273d709@us-cdbr-east-02.cleardb.com/heroku_8fbee8686ff81c6?reconnect=true'
/*const db = mysql.createConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "bcabfc9f759312",
    password: "8273d709",
    database: 'heroku_8fbee8686ff81c6'
  });*/
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Beautiful#3",
    database: 'users'
  })
  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to SQL database!");
  });
  module.exports = db;