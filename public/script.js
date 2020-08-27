//import { text } from "express";

//import { PeerServer } from "peer";

//front-end javascript
//const socket = io() - works for chrome only
const socket = io('/') //works for chrome only
const videoGrid = document.querySelector('#video__grid');
const clientVideo = document.createElement('video');
//prevents video from, being played straight away
//clientVideo.muted = true;

//path is from server.js app.use call where a peer Sercer is instantiated here
//use 443 when deploying to heroku
//https://stackoverflow.com/questions/63122313/websocket-failed-invalid-frame-header
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443',
});

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
//when user approves streaming. The stream is passed into 
// the addVideoStream function and a video element is created using 'myvideo'
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    
peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
})

socket.on('user-connected', userID=>{
    connectToNewUser(userID, stream);
})
//paste here
})
socket.on('user-disconnected', userID => {
    if (peers[userID]) peers[userID].close()
})
  
//get room id from ROOM_ID variable in room.ejs when peer connection
// is opened
peer.on('open', ID => {
    console.log(ID)
    console.log(ROOM_ID)
//when you join the room emit the join-room function which
//is created in the server. 
socket.emit('join-room', ROOM_ID, ID);
})

//when sockets connects user a video stream is added to a video element
const connectToNewUser = (userID, stream) => {
    //call another user and send him my stream
    const call = peer.call(userID, stream)
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
socket.on('createMessage', message => {
    $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
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
