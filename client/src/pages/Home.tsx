// import React from 'react';
import '../styles/Home.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, ReactNode } from 'react';
import Logo from '../components/Logo';
import AppInfo from '../components/AppInfo';
import TerrenceWrapper from '../components/TerrenceWrapper';
import Wrapper from '../components/Wrapper';

function Home(): JSX.Element {
  const { isAuthenticated, loginWithPopup } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated && navigate('/dashboard');
  });
  // TODO: HERE DO A: "JOIN A PARTY" BUTTON -> OPEN INPUT, you type in the code and you get redirected to that party room.
  return (
    <Wrapper>
      <TerrenceWrapper>
        <Logo />
        <div className="slogan">
          <h1 className="removeDefaultStyling"> Frame It </h1>
          <h2 className="removeDefaultStyling"> Share It </h2>

          <button
            onClick={() =>
              loginWithPopup({
                returnTo: 'http://localhost:3000/dashboard',
              })
            }
            className="logButton"
          >
            LOGIN
          </button>
        </div>
      </TerrenceWrapper>
      <AppInfo />
    </Wrapper>
  );
}

export default Home;
