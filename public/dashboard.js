/*console.log('script deferred')
const selectAllSearches = document.querySelectorAll('.addClickEvent')
const selectAllSearchesArray = [...selectAllSearches]
for(let i=0; i<selectAllSearchesArray.length; i++){
selectAllSearchesArray[i].addEventListener('click', e => handleUserAdd(e))
}
function handleUserAdd(e){
console.log('addededede')
if(!e.currentTarget.classList.contains('status4') && !e.currentTarget.classList.contains('status2')){
     console.log('line 183 clickeedd')
  
         var xhttp = new XMLHttpRequest();
 xhttp.open("POST", "/addfriend", true);
 xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 xhttp.send(`username=${iconWrapperArray[i]}&id=${document.body.id}`);
 xhttp.onreadystatechange = function() {
 console.log('xhr ready state change')
 //based on what is returned
if (xhttp.readyState === 4 && xhttp.response == 'user_added') {
 iconWrapperArray[i] += ' search__result_pending'
 iconWrapperArray[i].textContent = ''
 const icon = document.createElement('i')
 iconWrapperArray[i].appendChild(icon);
 icon.classList += 'fas fa-address-book';

}
}
   }}*/
   const socket = io('/');
   console.log('dashboard')
   socket.emit('join-dashboard')
   const friendsOnClick = document.querySelectorAll('.dashboard__searchResult')
   const friendsOnClickArray = [...friendsOnClick];
   for (let i =0; i<friendsOnClickArray.length; i++){
     friendsOnClickArray[i].addEventListener('click', function(e){
       console.log('body id', document.body.id)
      socket.emit('getIDOfReceiver', e.currentTarget.getAttribute('id'), document.body.getAttribute('id'))
  })
}
let receivingID = 0000;
socket.on('sendCallID', function(receiverID, senderID ){
  console.log('sendcallID rec', receiverID)
  console.log('sendcallID send', senderID)
  if(document.body.id == receiverID){
    receivingID = receiverID
    //open up a display on the user
    console.log('broadcast received')
    //add event listeners here and a receive call based on which is shown. I also need
    document.querySelector('.callNotificationWrapper').style.display = 'flex'
    handleCallSound()
    //a hidden display for skype
    document.querySelector('.callButtonAnswer').addEventListener('click', async function(e){
      await socket.emit('receiveCall', 'answer');
      socket.emit('callReturnStatus');
      //console.log(socket.emit('callReturnStatus'));
      document.querySelector('.callNotificationWrapper').style.display = 'none';
      handleCallSound()
    })
    document.querySelector('.callButtonReject').addEventListener('click', async function(e){
      await socket.emit('receiveCall', 'reject');
      document.querySelector('.callNotificationWrapper').style.display = 'none';
      handleCallSound()
      document.querySelector('.callRejectionWrapper').style.display = 'flex';
      setTimeout( function(){document.querySelector('.callRejectionWrapper').style.display = 'none'}, 1000);
    })
    document.querySelector('.callUsername').textContent = ''
  }
})
socket.on('callReturnStatus', function(callstatus, myid, receivingid){
  console.log('my id is', myid)
  console.log('document body id', document.body.id)
  console.log('receiving id', receivingID)
  if(document.body.id == myid){
    if(callstatus == 'reject'){
      document.querySelector('.callRejectionWrapper').style.display = 'flex';
      setTimeout( function(){document.querySelector('.callRejectionWrapper').style.display = 'none'}, 1000);
    }
    if(callstatus == 'answer'){
      window.location.pathname = `/room/${myid}`
    }
  }
  if (document.body.id == receivingID){
    if(callstatus == 'reject'){
      return
    }
    if(callstatus == 'answer'){
      window.location.pathname = `/room/${myid}`
    }
  }
})
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
socket.on('getUsername', function(){
  console.log('getUSername funciton')
  return getReceiverUsername()
})


//document.querySelector('.callRejectionWrapper').style.display = 'flex'
   
//socket.on('receiveCall', function)


///////////////////////////////////////////////////////////
   /*
   const customGenerationFunction = () =>{ return (Math.random().toString(36) + '0000000000000000000').substr(2, 16)};
   const peerID = customGenerationFunction()
   const myPeer = new Peer({
     path: '/peerjs',
     host: '/',
     port: '3030',
     generateClientId: peerID,
     config: { iceServers: [
      { urls: 'stun:stun.l.google.com:19302'  }, 
      { urls: 'stun:stun1.l.google.com:19302' }, 
      { urls: 'stun:stun2.l.google.com:19302' }, 
  ] }
  */
///////////////////////////////////////////////////////////////////////




    /*
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302'  }, 
        { urls: 'stun:stun1.l.google.com:19302' }, 
        { urls: 'stun:stun2.l.google.com:19302' }, 
    ]
    */
    /*
    config: { 'iceServers': [
    { 'urls': 'stun:stun1.l.google.com:19302' },
     {
      'urls': 'turn:relay.backups.cz',
     'credential': 'webrtc',
     'username': 'webrtc'
     }
    ] }
    */
     /*config: {
      'iceServers': [{
              url: 'stun:stun1.l.google.com:19302'
          },
          {
              url: 'turn:numb.viagenie.ca',
              credential: 'muazkh',
              username: 'webrtc@live.com'
          }
      ]
 }*/
////////////////////////////////////////////////////////////////////////////////////

/*
});
*/



//////////////////////////////////////////////////////////////////////
 /*myPeer.on('open', function(){
   console.log('on.open')
 })*/
 /*
 let conn = myPeer.connect('calling');
 conn.on('open', function(id){
   console.log('.on(connection)')
   console.log('id', id)
   conn.send('hi!')
 });
 myPeer.on('connection', function(conn){
   conn.on('data', function(data){
     console.log('receieved')
     console.log('received on sendder:', Date.now())
   })
 });
 console.log(myPeer.connections)
 */

 //start connection- provides a data connection object
 ////////////////////////////////////////////////////////////////////////////////////
 /*
 console.log('dashboard.js')
const peers = [];
 //add peers array???
myPeer.on('open', function(){
 socket.emit('callUser')
 //document.body.id takes a while I need to have these scripts run after
 const currentID = document.body.id
 //myPeer.connect('callUser')
 console.log('users ID', currentID)
})
const conn = myPeer.connect(peerID)

//myPeer.on('connection', function(){
  //when socket and peer is opened this is emitted
socket.on('establishConnection', function(){
   console.log('establishConnection')
   console.log('conn', conn)
  // myPeer.connect('callUser')
   conn.on('open', function(){
   //receive messages
   console.log('connection opened')
   conn.on('error', function(err){
     console.log('error:', err)
   })
   conn.on('data', function(data){
     alert('data')
     console.log('Received', data)
   })
   //send messages - addeventlistener for mouse click here and send target user's id
 conn.send('Hello!')
 //myPeer.dis
 })
})
//})
//if the message received is the users id then send back 'answer' or 'reject'
//then send this and also need to set up a listener for this to resolve this
myPeer.on('connection', function(conn){
  //needed on chrome according to github issues
  data.open = true;
 console.log('connection- conn object', conn)
 conn.on('data', function(data){console.log('data is in conn.on(data)', data)})
})

window.addEventListener('beforeunload', function(){
  socket.close();
  conn.close()
});

myPeer.on('error', function(err){
  console.log('error:', err)
})
conn.on('error', function(err){
  console.log('callUser error', err)
})
myPeer.on('close', function(){
  conn.close()
})
myPeer.on('disconnected', function(){
  conn.close()
})
////////////////////////////////////////////////////////////////////////////////////
*/
/*
//receive connection- provides a data connection object
myPeer.on('connection', function(conn){
 console.log('conn', conn)

conn.on('open', function(){
 console.log('id')
 alert('conn is open')
 //receive messages
 conn.on('data', function(data){
   alert('data')
   console.log('Received', data)
 })
 //send messages
 conn.send('Hello!')
})
})
*/
