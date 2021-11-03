import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import styled from 'styled-components';
import Countdown from 'react-countdown';

const MyVideo = styled.video`
  width: 22%;
  height: 22%;
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

const MainVideo = styled.video`
height: 100vh;
`;

// Renderer callback with condition
const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <div> We aren't finding anyone. Please keep this page open and we will keep looking </div>
  } else {
    // Render a countdown
    return <span>{minutes}:{seconds}</span>;
  }
};

const Room = (props) => {
  
  const
  {
    match: {
      params: {
        roomId,
      },
    },
    userId
  } = props;


  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const [stream, setStream] = useState();
  const streamRef = useRef()
  const peerRef = useRef();
  const [searching, setSearching] = useState(true);

  function connectToUser(otherUserId) {
    const peer = peerRef.current;
    console.log("peer before clal", peer)
    console.log("Calling ", otherUserId, " with ", stream)
    const call = peer.call(otherUserId, streamRef.current)

    console.log("CALL", call)

    call.on('stream', userVideoStream => {
      console.log("stream coming in", userVideoStream)
      partnerVideo.current.srcObject = userVideoStream;
      setSearching(false);
    })

    call.on('close', () => {
      partnerVideo.current = null
      setSearching(true);
    })
  }


  useEffect(() => {
    console.log("RUNNING THE USEEFFECT HERER")
    socket.current = io.connect("http://localhost:3000", { transports : ['websocket'] });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      streamRef.current = stream;
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on('user-disconnected', userId => {
      if (partnerVideo.current) {
        setSearching(true);
        partnerVideo.current.srcObject = null
      }
    })
    
    const peer = new Peer({
      initiator: true,
      stream: stream,
      host: '/',
      port: 3001
    })
    peerRef.current = peer;

    peer.on('open', id => {
      socket.current.emit('set userId', userId);
      socket.current.on('ready userId', function () {
        console.log('Associated! Going to join room');
        socket.current.emit('join-room', roomId, id)
      });
    })

    peer.on('call', call => {
      console.log("Receiving a call. Answering it now")
      setSearching(false)
      call.answer(streamRef.current)

      call.on('stream', stream => {
        console.log("Stream incoming")
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
        }
      })
      call.on('close', () => {
        console.log("Stream from incoming call closed")
        partnerVideo.current = null
        setSearching(true);
      })
    })

    socket.current.on('user-connected', userId => {
      console.log("user connected", userId)
      // user is joining
      setTimeout(() => {
        // user joined
        connectToUser(userId)
      }, 1000)
    })

  }, [])

  useEffect(() => {
    return () => {
      console.log("UNMOUNTING")
    }
  }, [])


  let UserVideo;
  if (stream) {
    UserVideo = (
      <MyVideo playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo = (
      <MainVideo muted playsInline ref={partnerVideo} autoPlay />
  );
  
  return (
    <div style={{backgroundColor: 'black'}}>
      {searching && <div style={{backgroundColor: 'white'}}> Searching for partner ... <br/> <Countdown renderer={countdownRenderer} date={Date.now() + 299 * 1000} /> </div> }
      {UserVideo}
      {PartnerVideo}
    </div>
  );
};

export default Room;