import { useEffect, useState } from 'react';
import { Grid } from 'react-loader-spinner';
import { io } from 'socket.io-client';
import { generateRandomString, getSocketRoomId } from '../ApiServices';
import '../styles/animations.css';
import '../styles/Dashboard.css';
import LogButton from './LogButton';

type PhotosGridProps = {
  id: string;
};
/*
  Here you:
  1. get the array of photos from the database (socket.io)
  2. map it, displaying a photo component for every one of them
  */

function PhotosGrid({ id }: PhotosGridProps) {
  const [buffer, setBuffer] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 7000);

    const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 3000);
    });

    async function fetchSocketRoomId() {
      const socketRoomId = await getSocketRoomId(id);
      socket.emit('join-room', socketRoomId);
    }
    fetchSocketRoomId();

    socket.on('pics', (data) => {
      setBuffer(data);
    });
  }, []);

  function handleLoaded() {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  }

  useEffect(() => {
    setPhotos(buffer);
  }, [buffer]);

  function openModal(picUrl: string) {
    setModalOpen(true);
    setModalUrl(picUrl);
  }

  function closeModal() {
    setModalOpen(false);
    setModalUrl('');
  }

  async function downloadImage(imageSrc: string) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = generateRandomString(8);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div
        className={modalOpen ? 'modal' : 'modal invisible'}
        onClick={closeModal}
      >
        <img src={modalUrl} className="innerModal"></img>
        <LogButton
          className="zidx"
          onClick={() => downloadImage(modalUrl)}
        >
          DOWNLOAD ⬇️
        </LogButton>
      </div>

      <div className={loading ? 'loaderWrap' : 'invisible'}>
        <Grid
          height="80"
          width="80"
          color="#8139d1"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>

      <div className="container">
        <div className="gridContainer">
          {photos.map((pic, idx) => {
            return (
              <img
                className={loading ? 'gridItem' : 'gridItem visible'}
                key={idx}
                src={pic}
                onLoad={handleLoaded}
                onClick={() => openModal(pic)}
              ></img>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PhotosGrid;
