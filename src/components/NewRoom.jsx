import React, { useEffect, useState, useRef } from 'react';
import Tile from './Tile/Tile'
import Grid from '@mui/material/Grid';
import { withRouter } from 'react-router';
import './VideoGrid/VideoGrid.css'
const NewRoom = (props) => {
  const [users, setUsers] = useState([])
  const streamRefs = useRef([])
  const [numUsers, setNumUsers] = useState(1)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      console.log(streamRefs.current, stream)
      //streamRefs.current.push(stream);
      streamRefs.current[0].srcObject = stream;
      
      //setStreamState(newStreamState)
    }).catch(e => {
      console.error(e)
      alert("Cant use the app if you dont grant all permissions (You may be using your camera in another app)");
      //history.push("/")
    })
  }, [])

  console.log(numUsers, streamRefs.current, new Array(numUsers))

  let videos = [...Array(numUsers)].map((x, index) => {
    console.log(index, streamRefs.current[index], "erererer")
    return (
      <Grid item xs={4} key={index}>
        <div style={{flex: 1}} className="video-grid-participant">
          <video className="video" playsInline muted ref={ref => streamRefs.current.push(ref)} autoPlay />
        </div>
      </Grid>)
  })
  console.log(videos, "jere")
  console.log(streamRefs.current)
  return (
    <div style={{height: '100%'}}>
    {/* <div style={{display: "flex"}} className="video-grid-container">
      <div className="video-grid">
        <Tile isLarge={true}/>
        <Tile isLarge={false}/>
      </div>
    </div> */}
    <Grid container spacing={2} style={{height: '100%', padding: 10, marginRight: 'auto', marginLeft: 'auto'}}>
      {/* {
        streamRefs.current.map((x) => {
          <Grid item xs={4} key={x}>
            <video playsInline muted ref={x} autoPlay/>
            <Tile/>
          </Grid>
        })
      } */}
      {videos}

    </Grid>
    {}
    </div>

  );
};

export default withRouter(NewRoom);