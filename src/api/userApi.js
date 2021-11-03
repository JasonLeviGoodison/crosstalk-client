
const BASE_ADDRESS = "http://localhost:3000";//process.env.REACT_APP_API_URL;

export async function GetUserId() {
  let userId = localStorage.getItem('userId')
  if (userId === null) {
    userId = await CreateNewEmphemeralAccount();
    localStorage.setItem('userId', userId)
  }

  return userId;
}

export async function CreateNewEmphemeralAccount() {
  const res = await fetch(`${BASE_ADDRESS}/users/createNewEphemeralAccount`, { method: 'POST', body: JSON.stringify({}) });
  console.log("res", res)
  const json = await res.json();

  const { _id: userId } = json;

  return userId;
}