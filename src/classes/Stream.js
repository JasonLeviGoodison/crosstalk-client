import io from 'socket.io-client';
import Peer from 'peerjs';

export default class Stream {
  constructor() {
    this.socket = io.connect(process.env.REACT_APP_API_URL, { transports : ['websocket'] });
    this.peer = new Peer({
      initiator: true,
      stream: stream,
      host: 'peerjs-server.herokuapp.com',
      port: 443,
      secure: true
    });
  }

  GetSocket() {
    return this.socket;
  }

  GetPeer() {
    return this.peer;
  }

  GetMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  }
}