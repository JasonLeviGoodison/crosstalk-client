import * as userApi from './userApi';
const BASE_ADDRESS = "http://localhost:3000";//process.env.REACT_APP_API_URL;


export async function GetJoinableRoom(language) {
  console.log("whats my id")
  const userId = await userApi.GetUserId();
  console.log("got one, its ", userId)
  const res = await fetch(`${BASE_ADDRESS}/rooms/getJoinableRoom/${language}/${userId}`);
  const json = await res.json();

  const { roomId } = json;

  return roomId;
}