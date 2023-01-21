// import React from 'react';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AppInfo from '../components/AppInfo';
import Logo from '../components/Logo';
import '../styles/Dashboard.css';
import Wrapper from '../components/Wrapper';
import TerrenceWrapper from '../components/TerrenceWrapper';
import SloganWrapper from '../components/SloganWrapper';

// reachable at /party/:id/ph
function JoinRoom(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  function handleRedirect() {
    navigate(`/party/${id}/ph/add`);
  }

  return (
    <Wrapper>
      <TerrenceWrapper>
        <Logo />
        <SloganWrapper className="welcome">
          <button onClick={() => handleRedirect()} className="logButton">
            Join As Guest
          </button>
        </SloganWrapper>
      </TerrenceWrapper>
      <AppInfo />
    </Wrapper>
  );
}

export default JoinRoom;
