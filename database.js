const mysql = require('mysql');
const cleardb= 'CLEARDB_ONYX_URL: mysql://bcabfc9f759312:8273d709@us-cdbr-east-02.cleardb.com/heroku_8fbee8686ff81c6?reconnect=true'
const db = mysql.createPool({
    host: "us-cdbr-east-02.cleardb.com",
    user: "bcabfc9f759312",
    password: "8273d709",
    database: 'heroku_8fbee8686ff81c6',
    connectionLimit: 10,
    //connectTimeout: 999999
  });
  /*
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Beautiful#3",
    database: 'users'
  })
  */
 /*
  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to SQL database!");
  });
  */
  //db.get_conn().ping(True)

 db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

  module.exports = db;

  /*
Terminating connections
There are two ways to end a connection. Terminating a connection gracefully is done by calling the end() method:

connection.end(function(err) {
  // The connection is terminated now
});
This will make sure all previously enqueued queries are still before sending a COM_QUIT packet to the MySQL server. If a fatal error occurs before the COM_QUIT packet can be sent, an err argument will be provided to the callback, but the connection will be terminated regardless of that.

An alternative way to end the connection is to call the destroy() method. This will cause an immediate termination of the underlying socket. Additionally destroy() guarantees that no more events or callbacks will be triggered for the connection.

connection.destroy();
Unlike end() the destroy() method does not take a callback argument.


  */