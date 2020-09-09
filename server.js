const express = require('express');
const app = express();
require('./database');
const server = require('http').Server(app);
const bodyParser = require('body-parser'); 
//same as http.createServer()
// app.listen also does the same thing as server.listen with the server created above.
// the advantage of setting a variable as const Server is that you
// can reuse the server for listening to other requests.
const io = require('socket.io')(server, {origins: '*:*'}, CLIENTS = []);
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
const db = require('./database');
//


app.use(cors())
//SETUP
const peerServer = ExpressPeerServer(server, {
    debug: true
    //proxied: true
})
app.use('/peerjs', peerServer);
app.use(express.static('public'));
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
//When socket io is connected/initiated on script.js, this is called
//when the room is joined 'user-connected'is emitted to broadcast video
//a listener is created for message which allows messages to be emitted.
//roomID and userID are likely part of the socket object and are passed into the broadcast.emit function
// this tells the socket who to connect to.
let recieverIDSERVER = 0;
let myIDSERVER = 0;
let receiverUsername = ''
let myUsername = ''
io.on('connection', socket => {
    //console.log('sockets', io.sockets.clients())
    socket.on('join-room', (roomID, userID) => {
        console.log('room joined on socket- roomID:', roomID)
        console.log('room joined on socket- userID:', userID)
        console.log('room joined on socket- ***socket', socket.handshake.headers)
        console.log('***')
        //this functions works only once room.ejs ROOM_ID variable is created
        socket.join(roomID)
        //when the user joins room tells the app the user connected so they can be added to the stream
        socket.to(roomID).broadcast.emit('user-connected', userID);
        console.log('roomID', roomID)
        console.log('userId', userID)
        socket.on('message', message => {
            //send message to the same room
            io.to(roomID).emit('createMessage', message)
        })
        socket.on('disconnect', () => {
            console.log('socket disconnected')
            socket.to(roomID).broadcast.emit('user-disconnected', userID)
        })
    })
    socket.on('join-dashboard', function(){
       // await socket.join('dashboard')
       socket.on('getMyUsername', function(username){
           console.log('clients indexof', CLIENTS.indexOf(username));
           if(CLIENTS.indexOf(username) == -1){
               console.log('username', username);
               console.log('CONDITIONAL ie CLIENTS[username]', CLIENTS[username]);
               CLIENTS.push(username);
               console.log('LIST OF CLIENTS', CLIENTS);
               socket.emit('clientChange', CLIENTS);
           }
       });
       socket.on("getIDOfReceiver", async function(receieverid, myid) {
        recieverIDSERVER = receieverid;
        myIDSERVER = myid;
        let receiverUsername = '';
        const sql = `SELECT * FROM userdata WHERE id = ${recieverIDSERVER}`
        await db.query(sql, function(err,data){
            if(err){
                console.log(err)
                io.emit('sendCallID', recieverIDSERVER, myIDSERVER, receiverUsername)
            } else {
                console.log('my receiver username', data[0].username)
                receiverUsername = data[0].username
                console.log('preSendCallID', receiverUsername)
                io.emit('sendCallID', recieverIDSERVER, myIDSERVER, receiverUsername)
            }
        })
      });
      socket.on('showCall', function(){
          return getReceiverUsername();
      });
      socket.on('getUsername', () => {
        console.log('getUSername funciton')
        return getReceiverUsername()
      })
        socket.on('receiveCall', function(callstatus){
        console.log('call status', callstatus)
        io.emit('callReturnStatus', callstatus, myIDSERVER, recieverIDSERVER)
    })
    socket.on('disconnect', function(){
        console.log('socket disconnected')
        io.emit('removeUserFromActiveOnDisconnect', CLIENTS, myUsername);
        socket.emit('clientChange', CLIENTS);
        console.log('socket clients on disconnect', CLIENTS)
    })
    /*socket.on('callUser', function(){
        socket.emit('establishConnection')
    })*/
})
});
function getReceiverUsername(){
    const sql = `SELECT * FROM userdata WHERE id = ${receivingID}`
    db.query(sql, function(err,data){
        if(err){
            console.log(err)
        } else {
            console.log('my receiver username', data[0].username)
            return data[0].username
        }
    })
  }
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


