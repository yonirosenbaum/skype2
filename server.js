const express = require('express');
const app = express();
//const cors = require('cors');
const server = require('http').Server(app);
const bodyParser = require('body-parser'); 
//same as http.createServer()
// app.listen also does the same thing as server.listen with the server created above.
// the advantage of setting a variable as const Server is that you
// can reuse the server for listening to other requests.
const io = require('socket.io')(server);
const cors = require('cors');
//Allows different clients to interact with one another
// so they can send requests to each other without a server.
const {ExpressPeerServer} = require('peer');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./controllers/authentification');
const Router = require('./router');
const expressSession = require('express-session');

//SETUP
const peerServer = ExpressPeerServer(server, {
    debug: true
})
app.use(express.static('public'));
app.use(cors())
app.use('/peerjs', peerServer);
app.use(bodyParser.json('*/*'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
// SQL SETUP
require('./database');
//COOKIES SETUP
app.use(cookieParser());
app.use(expressSession({
    name: 'user',
    secret: 'emdemdmeodmo',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        secure: false, //for production set to true for https only access
        httpOnly: false, //true means no access from javascript
    },
    resave: false,
    saveUninitialized: true, //false for production GDPR laws in Europe- program can only save cookies with implied consent
}))
//VIEW ENGINE SETUP
app.set('view engine', 'ejs');
//SOCKETS SETUP
io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        //this functions works only once room.ejs ROOM_ID variable is created
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userID);
        socket.on('message', message => {
            //send message to the same room
            io.to(roomID).emit('createMessage', message)
        })
    })
})
/*
//LOGIN FORM HANDLING
// this is actualy the create user form data and not the find user
app.post('/createuser', function(req,res,next){
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim().toLowerCase();
    const sql = `INSERT INTO userdata (username, password)
    VALUES ('${username}', '${password}')
    `
    db.query(sql, function(err, data){
        if(err){
            throw err;
        }
        console.log('record inserted')
    })
})
app.post('/userlogin', function(req,res,next){
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim().toLowerCase();
    const sql = `SELECT * FROM userdata WHERE username = '${username}' AND password = '${password}'
    `
    db.query(sql, function(err, data){
        if(err){
            throw err;
        }
        if(!data[0]){
            console.log('Please enter a valid username and password')
            //next({message: 'Please enter a valid username and password'})
        }
        if(data.length > 0){
            console.log('grater than 0')
            console.log(data[0].username)
            console.log(typeof data)
            console.log(data.length)
            res.redirect('/dashboard.html')
            authRoutes(data[0].id)
        }
    })
    
})
*/
//app.set('view engine', 'ejs');

//ROUTING
Router(app)

const PORT = process.env.PORT || 3030;

server.listen(PORT, ()=>{
    console.log('Server is listening on port:', PORT)
});

