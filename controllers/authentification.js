const jwt = require('jwt-simple');
const config = require('../config');
const db = require('../database');

//DO I PUT (NEXT) IN THIS???
// encode the user id since this will be consistent to use as a token
const tokenForUser = (id) => {
    const timestamp = new Date().getTime()
    console.log('sub:', id, 'iat:', timestamp)
    const JWTtoken = jwt.encode({sub: id, iat: timestamp}, config.secret);
    console.log(JWTtoken)
    return JWTtoken
}

//token is sent to res.body
exports.signin = async function(req, res, next){
    console.log('authentification.signin')
    console.log(req.body)
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim().toLowerCase();
    const sql = `
    SELECT * FROM userdata WHERE username = '${username}' AND password = '${password}' 
    `
    await db.query(sql, function(err, data){
      if(data[0]){
        req.session.user = 
          {id: data[0].id}
          console.log('req.session', req.session)
          console.log('req.body', req.body)
          res.redirect('/dashboard')
      }
      if(err){
        console.log(err)
      }
      if(!data[0]){
        res.render('login', {renderErrorMessage: 'true'})
      }
    })
   //res.render('dashboard')
}

//do a test for lowecase on sign up and return to sign up page- with error 'please only type in lowercase letters for username password'

//RENDER WARNING MESSAGE ON SIGNIN
exports.signup = async function(req,res,next){
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim().toLowerCase();
    if(!username || !password){
        res.render('signup', {userExists: "Enter a username and password"})
    }
    else{
      console.log('precheckifUserExists', username)
      const checkIfUserExists = `SELECT * FROM userdata WHERE username = '${username}'`;
      await db.query(checkIfUserExists, async function(err,data){
        if(err){
          console.log('err')
          res.render('signup')
        }
        else if(data[0]){
          //res.send('user exists already')
          console.log('else if(data[0])')
          res.render('signup', {userExists: "User already exists"})
        }
        else{
          console.log('else')
      const sql = ` INSERT IGNORE INTO userdata (username, password) VALUES
          ('${username}', '${password}')
      `
      console.log('username', username)
      console.log('password', password)
      console.log('sql', sql)
      let initialSQL = '';
      await db.query(sql, async function(err, data){
        if(err){
          console.log(err)
        } else{
          //console.log('1 record inserted')
          initialSQl = 'pass'
          console.log('1 record inserted into userdata')
    
      let userId;
      console.log('username', username)
      const getId = `SELECT * from userdata WHERE username = '${username}'`
      await db.query(getId, function(err, data){
        if(err){
          console.log(err)
        } else{
          console.log(data[0].id)
          userId = data[0].id;
          req.session.user = 
          {id: userId}
          //console.log('id', userId)
         // console.log('data', data.insertId)
         const createTable = `CREATE TABLE ${username}(
          id int PRIMARY KEY,
          username VARCHAR(20),
          status int
        )`
        db.query(createTable, function(err, data){
          if(err){
            console.log(err)
          } else{
            //console.log('table created')
            //console.log(data)
            res.redirect('/dashboard')
          }
        })
        }
      })
    }
  })
    }
  })
    }}