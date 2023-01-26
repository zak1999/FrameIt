export function generateRandomString(length: number): string {
  let result: string = '';
  const characters: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function createOwner(userEmail: string): Promise<boolean> {
  try {
    const data = { email: userEmail };
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/owner`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    return response.status === 200 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createParty(email: string): Promise<string> {
  const data = { email };
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/users/party/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  const { party_id } = result;
  return party_id;
}

export async function checkForParty(email: string): Promise<string> {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/users/info/party/${email}`
  );
  const result = await response.json();
  return result['party_id'];
}

export async function deleteParty(id: string): Promise<string> {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/party`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  const result = await response.json();
  return result['completed'];
}

export async function sendImage(imageData: Blob): Promise<string> {
  const formData: FormData = new FormData();
  formData.append('file', imageData, generateRandomString(10));
  formData.append('upload_preset', `${process.env.REACT_APP_UPLOAD_PRESET}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  const result = await response.json();
  return result['secure_url'];
}

export async function sendUrlToDb(url: string, id: string): Promise<string> {
  const data = {
    url: url,
    partyId: id,
  };
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/party/upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result['completed'];
}

export async function getSocketRoomId(id: string): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/party/socketRoom/${id}`
    );
    // Will return the socket room ID or '' if something goes wrong in the backend.
    const { socket_room_id } = await response.json();
    return socket_room_id;
  } catch (error) {
    // Return an empty string if something goes wrong within this try-catch.
    return '';
  }
}

export async function checkRoom(id: string) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/party/${id}`
    );
    return await response.json();
  } catch (error) {
    return { exists: false };
  }
}
