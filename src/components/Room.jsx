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
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

const MyVideo = styled.video`
  width: 22%;
  height: 22%;
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

const MainVideo = styled.video`
  height: 100%;
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
        // this is a really bad default setting
        native = 'English',
        learning = 'Spanish'
      }
    }
  } = props;


  const userVideo = useRef();
  const [newRoom, setNewRoom] = useState(0)
  const partnerVideo = useRef();
  const socket = useRef();
  const streamRef = useRef()
  const peerRef = useRef();
  const [searching, setSearching] = useState(true);
  const [theirMicOn, setTheirMicOn] = useState(true);
  const [myMicOn, setMyMicOn] = useState(true);
  const [audioList, setAudioList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [audioDeviceId, setAudioDeviceId] = useState(null)
  const [videoDeviceId, setVideoDeviceId] = useState(null)

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
    // first thing we do is get the devices
    console.log("CALLING USEEFFECT")
    updateDeviceList()

    console.log("devide settings", audioDeviceId, videoDeviceId)
    function connectToUser(otherUserId) {
      const peer = peerRef.current;
      console.log("Calling ", otherUserId, " with ", streamRef.current)
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
    if (socket.current != null) {
      socket.current.disconnect();
    }
    socket.current = io.connect(process.env.REACT_APP_API_URL, { transports : ['websocket'] });
    navigator.mediaDevices.getUserMedia({ video: {deviceId: videoDeviceId}, audio: { deviceId: audioDeviceId} }).then(stream => {
      console.log("got stream", stream)

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
  
      peer.on('open', peerId => {
        socket.current.emit('set user data', userId, peerId, native, learning);
        socket.current.on('ready userId', function () {
          console.log('Associated! Going to join room');
          socket.current.emit('join-room', roomId)
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
  
      socket.current.on('user-connected', otherPeerId => {
        console.log("user connected", otherPeerId)
        // user is joining
        setTimeout(() => {
          // user joined
          connectToUser(otherPeerId)
        }, 2000)
      })
      
    }).catch(e => {
      alert("Cant use the app if you dont grant all permissions (You may be using your camera in another app)");
      history.push("/")
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

  }, [roomId, userId, audioDeviceId, videoDeviceId])

  useEffect(() => {
    return () => {
      socket.current.disconnect();

      streamRef.current?.getTracks()
        .forEach((track) => {
          track.stop()
          track.enabled = false
        });
      streamRef.current = null;
    }
  }, [])

  function updateDeviceList() {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      const loa = []
      const lov = []
  
      devices.forEach(function(device) {
        let [kind, type, direction] = device.kind.match(/(\w+)(input|output)/i);

        if (direction !== 'input') {
          return;
        }
  
        if (type === "audio") {
          loa.indexOf(device === -1) && loa.push(device);
        } else if (type === "video") {
          lov.indexOf(device === -1) && lov.push(device);
        }
      });
      setAudioList(loa);
      setVideoList(lov);
    });
  }

  let UserVideo = (
      <MyVideo playsInline muted ref={userVideo} autoPlay />
    );

  let PartnerVideo = (
      <MainVideo muted={!theirMicOn} playsInline ref={partnerVideo} autoPlay />
  );
  
  return (
    <div style={{backgroundColor: 'black', height: '100%'}}>
      {searching && <div style={{backgroundColor: 'white'}}>
        Searching for partner ... <br/>
        If no one is on right now, join during an <a href="https://www.meetup.com/virtual-language-exchange-pidginpost"> event </a> where you'll be guarenteed to find a partner.
        <br/><Countdown renderer={countdownRenderer} date={Date.now() + 119 * 1000} /> </div> }

      {UserVideo}
      {PartnerVideo}

      <div className="control-container">
        <Tooltip title="Hang up">
          <Button variant="danger" onClick={() => history.push('/')}> <CallEndIcon fontSize="large"/> </Button>
        </Tooltip>
        <Tooltip title={"Find a new partner"}>
          <Button variant="danger" onClick={findNewRoom}> <NextPlanIcon fontSize="large"/> </Button>
        </Tooltip>
        <Dropdown as={ButtonGroup}>
          <Tooltip title={"Turn Mic " + (myMicOn ? "Off" : "On")}>
          <Button variant="primary" onClick={sendMicOffRequest}> { !myMicOn ? <MicOffIcon fontSize="large"/> : <MicIcon fontSize="large"/> } </Button>
          </Tooltip>

          <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic"/>

          <Dropdown.Menu id="dropDownMenu">
            {audioList.map(device => {
              return (<Dropdown.Item onClick={() => setAudioDeviceId(device.deviceId)} key={device.deviceId}>{device.label}</Dropdown.Item>)
            })}
          </Dropdown.Menu>
        </Dropdown>
        {/* TODO: UPDATE VARIABLES */}
        <Dropdown as={ButtonGroup}>
          <Tooltip title={"Turn Video " + (myMicOn ? "Off" : "On")}>
            <Button variant="primary" onClick={sendMicOffRequest}> { !myMicOn ? <VideocamOffIcon fontSize="large"/> : <VideocamIcon fontSize="large"/> } </Button>
          </Tooltip>

          <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic"/>

          <Dropdown.Menu id="dropDownMenu">
            {videoList.map(device => {
              return (<Dropdown.Item onClick={() => setVideoDeviceId(device.deviceId)} key={device.deviceId}>{device.label}</Dropdown.Item>)
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default withRouter(Room);