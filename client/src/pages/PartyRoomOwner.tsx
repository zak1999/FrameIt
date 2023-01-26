import { checkRoom } from '../ApiServices';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import PhotosGrid from '../components/PhotosGrid';

import '../styles/Dashboard.css';
import '../styles/animations.css';
import DashboardWrapper from '../components/DashboardWrapper';
import ShareButton from '../components/ShareButton';

function PartyRoomOwner(): JSX.Element {
  const { id } = useParams();
  const [copied, setCopied] = useState<boolean>(false);
  const [canShare, setCanShare] = useState<boolean>(false);
  const navigate = useNavigate();
  const [roomExists, setRoomExists] = useState<boolean>(true);
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) navigate(`/`);

    async function fetchRoom() {
      const exist = await checkRoom(id || '');
      setRoomExists(exist.exists);
    }
    fetchRoom();

    if (!navigator.share) {
      setCanShare(false);
    } else {
      setCanShare(true);
    }
  }, []);

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: 'FrameIt - Room',
          url: `${process.env.REACT_APP_HOST_URL}/party/}${id}/ph`,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      handleCopyLink();
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${process.env.REACT_APP_HOST_URL}/party/${id}/ph`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const goToPh = () => {
    navigate(`/party/${id}/ph/add`);
  };

  return (
    <DashboardWrapper>
      {isAuthenticated && roomExists ? (
        <>
          <div className="qrWrap">
            <h3 className="removeDefaultStyling">Room #{id}</h3>
            <QRCodeSVG
              bgColor="transparent"
              id="dash-qr"
              size={130}
              value={`${process.env.REACT_APP_HOST_URL}/party/${id}/ph`}
            />
            <ShareButton canShare={canShare} copied={copied} onClick={handleShare}/>
            <button className="mainButton" id='go-to-ph-btn' onClick={goToPh}>
              TAKE PICS FOR UR PARTY
            </button>
          </div>
          <div className="secondHalf">
            <PhotosGrid id={id || ''} />
          </div>
        </>
      ) : (
        <h1>Wrong Party :C</h1>
      )}
    </DashboardWrapper>
  );
}

export default PartyRoomOwner;
