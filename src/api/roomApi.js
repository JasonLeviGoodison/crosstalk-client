import * as userApi from './userApi';
const BASE_ADDRESS = process.env.REACT_APP_API_URL;


export async function GetJoinableRoom(native, language, roomToAvoid = null) {
  console.log("whats my id")
  const userId = await userApi.GetUserId();
  console.log("got one, its ", userId)

  const res = await fetch(`${BASE_ADDRESS}/rooms/getJoinableRoom/?native=${native}&learning=${language}&userId=${userId}`);
  const json = await res.json();

  const { roomId } = json;

  return roomId;
}


