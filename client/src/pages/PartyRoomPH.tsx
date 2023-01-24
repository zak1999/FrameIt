import { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  generateRandomString,
  sendImage,
  sendUrlToDb,
  checkRoom,
} from '../ApiServices';
import { ProgressBar } from 'react-loader-spinner';
import { useAuth0 } from '@auth0/auth0-react';
import { compress, downloadFile } from 'image-conversion';
import '../styles/Dashboard.css';
import Navbar from '../components/Navbar';
import PhotosGrid from '../components/PhotosGrid';
import LogButton from '../components/LogButton';
import Dashboard from './Dashboard';
import DashboardWrapper from '../components/DashboardWrapper';


// TODO: ADD PASSWORD TO PRIVATE ROOMS

// reachable at /party/:id/ph/add
function PartyRoomPH(): JSX.Element {
  const navigate = useNavigate();

  const { id } = useParams<string>();
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [something, setSomething] = useState('');
  const [photoTaken, setPhotoTaken] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth0();
  const [roomExists, setRoomExists] = useState<boolean>(true);
  const fotoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchRoom() {
      const { exists } = await checkRoom(id || '');
      setRoomExists(exists);
    }
    fetchRoom();
  }, []);

  async function sendIt(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // to prevent from doing this action twice if pressing the send button while sending
    // If it is not loading then we can do the submission logic, check for an input
    const photos = fotoRef.current?.files;
    console.log(1);
    if (!loading && photos) {
      console.log(2);
      setLoading(true);
      // const input = document.getElementById('foto').files[0];
      // const url = await sendImage(photoTaken);
      // Get the photo from the input and send it to the server, it takes a blob as an input
      const photo = photos[0];
      const photoUrl = await sendImage(photo);
      console.log(photoUrl);

      if (photoUrl) {
        console.log(3);
        // input.value = null;
        fotoRef.current = null;
        await sendUrlToDb(photoUrl, id || '');
        // setSomething(false);
        setSomething(photoUrl);
        console.log(something);
        setFileUploaded(false);
        setLoading(false);
      } else {
        alert('something went wrong :C');
      }
    }
  }

  async function downloadIt() {
    if (photoTaken) downloadFile(photoTaken, generateRandomString(8));
  }

  async function handleChange() {
    // Take the input from the photo input
    // const input = document.getElementById('foto');
    const photos = fotoRef.current?.files;
    if (photos) {
      const photo = photos[0];
      const compressed = await compress(photo, 0.4);
      setFileUploaded(true);

      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(compressed);
      fileReader.addEventListener('load', function () {
        setSomething(this.result as string);
      });
      setPhotoTaken(compressed);
    } else setFileUploaded(false);
  }

  function goBack() {
    navigate(`/party/${id}`);
  }
  return (
  <DashboardWrapper>
    {!roomExists ? (
      <h1>Wrong Room :C</h1>
    ) : (
      <>
        <div className="firstHalf">
          {' '}
          ROOM #{id}
          {isAuthenticated ? (
            <button onClick={goBack} className="mainButton">
              Back 2 the Lobby
            </button>
          ) : (
            ''
          )}
          <form id="formSend" onSubmit={sendIt}>
            <div className="fotoWrap">
              <label htmlFor="foto" className="mainButton">
                {fileUploaded ? 'Take another One 📸' : 'TAKE PHOTO 📸'}
              </label>
            </div>
            <input
              ref={fotoRef}
              id="foto"
              type="file"
              name="image"
              capture="environment"
              accept="image/*"
              onChange={handleChange}
            />
            {fileUploaded ? (
              <>
                <LogButton className="logButton" type="submit">
                  SEND
                </LogButton>
              </>
            ) : (
              <LogButton className="logButton">Placeholder</LogButton>
            )}
          </form>
        </div>

        {loading ? (
          <div className="secondHalf">
            <ProgressBar
              height="90"
              width="90"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass="progress-bar-wrapper"
              borderColor="#8139d1"
              barColor="#e5b9ed"
            />
          </div>
        ) : (
          <div className="secondHalf">
            {fileUploaded ? (
              <>
                <div className="imagePreview">
                  <img className="imagePreviewActually" src={something}></img>
                </div>
                <LogButton onClick={downloadIt}>
                  DOWNLOAD ⬇️
                </LogButton>
              </>
            ) : (
              <PhotosGrid id={id || ''} />
            )}
          </div>
        )}
      </>
    )}
  </DashboardWrapper>
  );
}

export default PartyRoomPH;
