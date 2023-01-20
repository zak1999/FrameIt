// import React from 'react';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AppInfo from '../components/AppInfo';
import Logo from '../components/Logo';
import '../styles/Dashboard.css';
import Wrapper from '../components/Wrapper';
import TerrenceWrapper from '../components/TerrenceWrapper';

// reachable at /party/:id/ph
function JoinRoom(): ReactNode {
  const { id } = useParams();
  const navigate = useNavigate();
  function handleRedirect() {
    navigate(`/party/${id}/ph/add`);
  }

  return (
    <Wrapper>
      <TerrenceWrapper>
        <Logo />
        <div className="welcome">
          <h1 className="removeDefaultStyling"> Frame It </h1>
          <h2 className="removeDefaultStyling"> Share It </h2>
          <button onClick={() => handleRedirect()} className="logButton">
            Join As Guest
          </button>
        </div>
      </TerrenceWrapper>
      <AppInfo />
    </Wrapper>
  );
}

export default JoinRoom;
