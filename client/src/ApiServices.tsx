// ✅
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

// ✅
export async function createOwner(userEmail: string): Promise<boolean> {
  try {
    const data = {
      email: userEmail,
    };
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

// ✅
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
  const res = await response.json();
  const { party_id } = res;
  return party_id;
}

export async function checkForParty(email: string): Promise<boolean | string> {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/users/info/party/${email}`
  );
  const responseText = await response.text();
  return response.status === 200 && responseText ? responseText : false;

  //   .then((response) => {
  //     if (response.status === 200) return response.text();
  //     else return false;
  //   })
  //   .then((response) => {
  //     if (response) return response;
  //     return false;
  //   });
  // return response;
}

export async function deleteParty(id: string): Promise<string> {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/party`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  return await response.text();

  //   .then((response) => response.text())
  //   .then((response) => response);
  // return response;
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

  // .then(async (res) => {
  //   const result = await res.json();
  //   return result['secure_url'];
  // });
  // return response;
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
  return await response.text();

  //   .then((response) => response.text())
  //   .then((response) => response);
  // return response;
}

export async function getSocketRoomId(id: string | undefined): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/party/socketRoom/${id}`
    );
    // .then((response) => response.text());
    const { socket_room_id } = await response.json();
    return socket_room_id;
  } catch (error) {
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
