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

   const myPeer = new Peer(undefined, {
     path: '/peerjs',
     host: '/',
     port: '443',
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
});
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
 console.log('dashboard.js')

 //add peers array???
myPeer.on('open', function(){
 socket.emit('callUser')
 const currentID = document.body.id
 //myPeer.connect('callUser')
 console.log('users ID', currentID)
})
const conn = myPeer.connect('callUser')

//myPeer.on('connection', function(){
  //when socket and peer is opened this is emitted
socket.on('establishConnection', function(){
   console.log('establishConnection')
   console.log('conn', conn)
   myPeer.connect('callUser')
   conn.on('open', function(){
   //receive messages
   console.log('connection opened')
   conn.on('data', function(data){
     alert('data')
     console.log('Received', data)
   })
   //send messages - addeventlistener for mouse click here and send target user's id
 conn.send('Hello!')
 })
})
//})
//if the message received is the users id then send back 'answer' or 'reject'
//then send this and also need to set up a listener for this to resolve this
myPeer.on('connection', function(conn){
 console.log('connection- conn object', conn)
 conn.on('data', console.log('data is in conn.on(data)', data))
})

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
