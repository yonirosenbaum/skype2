//import { text } from "express";

//import { PeerServer } from "peer";
//peer.connect connects to the remote server and returns a data connection
//peer.on('open') emitted when a connection to the peer server is established
//peer.on('connect') emitted when a data connection is established from the remote server


//pass my id from document.body into the peer constructor
//send on the dataconnection from the receiver a call
//the data.on('connection') listens for this and then sends the information back
// in the data.connection there is a conditional which says if the message 



//front-end javascript
//const socket = io() - works for chrome only
// refers to the host that servers the page ie look at'
//THIS IS THE LOCATION OF WHERE THE SERVER IS HOSTING THE SOCKET APP
const socket = io('/') //works for chrome only- set to '/' or just () returns current
const videoGrid = document.querySelector('#video__grid');
const clientVideo = document.createElement('video');
//prevents video from, being played straight away
//clientVideo.muted = true;

//path is from server.js app.use call where a peer Server is instantiated here
//use 443 when deploying to heroku
//https://stackoverflow.com/questions/63122313/websocket-failed-invalid-frame-header
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443',
    config: {'iceServers' : { 'urls': 'stun.l.google.com:19302',
    {
        'urls': 'turn:relay.backups.cz?transport=tcp',
        'credential': 'webrtc',
        'username': 'webrtc'
    }
}}

});
let myuser = '';
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//when user approves streaming. The stream is passed into 
// the addVideoStream function and a video element is created using 'myvideo'
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    //add my stream to the video and the stream created by navigator gets passed
    //as the src object to a new video element which is created.
    addVideoStream(myVideo, stream)
    //myPeer.call- starts a call
    //myPeer.on('call', call=>{})- answers call
    //below when recipient user is called they answer it and there own personal stream gets passed into the call.answer function
    //then when the stream is created the call.on('stream') function is called an a new video element is created of the sending user.
    console.log('streamobject - .then before myPeeron.on(call', stream)
myPeer.on('call', call => {
    //path conditional for dashboard 
    let streamid = stream.id;
    console.log('this is the stream id', streamid)
    console.log('call object - in myPeer.on(call)', call)
    document.querySelector('.callNotificationWrapper').style.display = 'flex';
    document.querySelector('.callButtonAnswer').addEventListener('click', function(e){
        console.log('callbutton clicked')
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    document.querySelector('.callNotificationWrapper').style.display = 'none'
})
    document.querySelector('.callButtonReject').addEventListener('click' ,function(){
       call.close();
       console.log('call rejected');
       document.querySelector('.callNotificationWrapper').style.display = 'none';
       document.querySelector('.callRejectionWrapper').style.display = 'flex';
       setTimeout(function(){
        document.querySelector('.callRejectionWrapper').style.display = 'none';
       }, 2000)
})
})

//'user-connected' is the event fired when.....  and passess in current user stream and userID
socket.on('user-connected', userID=>{
    console.log('peers', peers)
    console.log(userID, console.log(userID))
    connectToNewUser(userID, stream);
})
//paste here
})
//'user-disconnected' is the event fired when.....
socket.on('user-disconnected', userID => {
    if (peers[userID]) peers[userID].close()
})
  
//get room id from ROOM_ID variable in room.ejs when peer connection
// is opened
myPeer.on('open', ID => {
    console.log(ID)
    console.log(ROOM_ID)
//when you join the room emit the join-room function which
//is created in the server. 
socket.emit('join-room', ROOM_ID, ID);
})
//when sockets connects user a video stream is added to a video element
const connectToNewUser = (userID, stream) => {
    //call another user and send him my stream
    const call = myPeer.call(userID, stream)
    console.log('connectToNewUser stream', stream)
    console.log('connectToNewUser userID', userID)
    console.log('socket connectToNewUser###', socket)
    //create a video element
    const video = document.createElement('video');
    //When i receive a video stream I will add it to my client
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    console.log(stream)
    console.log('new user', userID)
    call.on('close', () => {
        video.remove()
      })
      peers[userID] = call
}

//add a video stream
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}
let inputText = $('input');
$('html').keydown((e)=>{
    // if enter key is pressed
    if(e.which == 13 && inputText.val().length !== 0){
        socket.emit('message', inputText.val())
        console.log(inputText.val())
        //clears input field after enter
        inputText.val('')
    }
})

socket.on('createMessage', function(message){
    $('.messages').append(`<li class="message"><br/>${message}</li>`)
    messageScrollToBottom()
})
//automatically scrolls messages to bottom when a new message is added.
const messageScrollToBottom = () => {
  let chatWindow  = $('.main__chat__window');
    chatWindow.scrollTop(chatWindow.prop("scrollHeight"));
}
const toggleMute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        unmuteButtonImage();
    } else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        muteButtonImage();
    }
}
const muteButtonImage = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}
const unmuteButtonImage = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute__button').innerHTML = html;
}
const toggleVideo = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        videoStopImage();
    } else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        videoPlayImage();
    }
}
const videoPlayImage = () => {
    const html = `
      <i class="videoStop fas fa-video-slash"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}
const videoStopImage = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video__button').innerHTML = html;
}
const toggleChat = () => {
    const mr = document.querySelector('.main__right');
    console.log(mr.style.display)
    if (mr.style.display == 'flex' || mr.style.display == ''){
    mr.style.display = 'none';
    }
    else if(mr.style.display == 'none'){
    mr.style.display = 'flex';   
    }
}
