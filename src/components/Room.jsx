import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import Button from 'react-bootstrap/Button';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import { Tooltip } from '@mui/material';
import { withRouter } from 'react-router';
import * as roomApi from '../api/roomApi';
import * as routes from '../routes';


const MyVideo = styled.video`
  width: 22%;
  height: 22%;
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

const MainVideo = styled.video`
height: 94vh;
width: 94vw;
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
    userId,
    history,
    location: {
      state: {
        native,
        learning
      }
    }
  } = props;


  const userVideo = useRef();
  const [newRoom, setNewRoom] = useState(0)
  const partnerVideo = useRef();
  const socket = useRef();
  const [stream, setStream] = useState();
  const streamRef = useRef()
  const peerRef = useRef();
  const [searching, setSearching] = useState(true);
  const [theirMicOn, setTheirMicOn] = useState(true);
  const [myMicOn, setMyMicOn] = useState(true);

  console.log("NATIVE", native, learning, props)

  async function findNewRoom() {
    console.log("Going to find another user to meet with")
    var newRoomId = await roomApi.GetJoinableRoom(native, learning);
    history.push({
      state: {
        learning,
        native
      },
      pathname: routes.ROOM + "/" + newRoomId
    })
    socket.current.disconnect();
    partnerVideo.current.srcObject = null
    // TODO: This is an ugly hack if I've ever seen one
    // force a new run of the useeffect to recreate the socket
    setNewRoom(newRoom + 1)
  }

  function sendMicOffRequest() {
    socket.current.emit("mic set", !myMicOn);
    setMyMicOn(!myMicOn);
  }


  useEffect(() => {
    
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

    console.log("RUNNING THE USEEFFECT HERER")
    socket.current = io.connect(process.env.REACT_APP_API_URL, { transports : ['websocket'] });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      streamRef.current = stream;
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }

      const peer = new Peer({
        initiator: true,
        stream: stream,
        host: 'peerjs-server.herokuapp.com',
        port: 443,
        secure: true
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
      
    })

    socket.current.on('user-disconnected', userId => {
      if (partnerVideo.current) {
        setSearching(true);
        partnerVideo.current.srcObject = null
      }
    })

    socket.current.on('mic set', (value) => {
      setTheirMicOn(value)
    })

  }, [roomId, userId])

  useEffect(() => {
    return () => {
      socket.current.disconnect();

      streamRef.current.getTracks()
        .forEach((track) => {
          track.stop()
          track.enabled = false
        });
        streamRef.current = null;
    }
  }, [])


  let UserVideo;
  if (stream) {
    UserVideo = (
      <MyVideo playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo = (
      <MainVideo muted={!theirMicOn} playsInline ref={partnerVideo} autoPlay />
  );
  
  return (
    <div style={{backgroundColor: 'black'}}>
      {searching && <div style={{backgroundColor: 'white'}}> Searching for partner ... <br/> <Countdown renderer={countdownRenderer} date={Date.now() + 299 * 1000} /> </div> }
      {UserVideo}
      {PartnerVideo}
      <div style={{ position: 'absolute', right: '46%', bottom: 10, display: 'flex', justifyContent: 'space-between', width: "13%"}}>
        <Tooltip title="Hang up">
          <Button variant="danger" onClick={() => history.push('/')}> <CallEndIcon fontSize="large"/> </Button>
        </Tooltip>
        <Tooltip title={"Turn Mic " + (myMicOn ? "Off" : "On")}>
          <Button variant="primary" onClick={sendMicOffRequest}> { !myMicOn ? <MicOffIcon fontSize="large"/> : <MicIcon fontSize="large"/> } </Button>
        </Tooltip>
        <Tooltip title={"Find a new partner"}>
          <Button variant="secondary" onClick={findNewRoom}> <NextPlanIcon fontSize="large"/> </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default withRouter(Room);