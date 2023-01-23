// import React from 'react';
import { useEffect, useState, MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import Loading from '../components/Loading';
import {
  createOwner,
  createParty,
  checkForParty,
  deleteParty,
} from '../ApiServices';
import DashboardWrapper from '../components/DashboardWrapper';

function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();
  const [partyId, setPartyId] = useState<string | boolean>('');
  const [isUp, setIsUp] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [askConfirm, setAskConfirm] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    async function fetchData() {
      if (isAuthenticated) {
        const userEmail = user && user.email ? user.email : '';
        const up = await createOwner(userEmail);
        // const up = await createOwner(user.email);
        setIsUp(up);

        setTimeout(() => {
          setLoading(false);
        }, 500);

        if (isUp) {
          const partyId = await checkForParty(userEmail);
          if (partyId) setPartyId(partyId);
        }
      }
    }
    fetchData();
    setTimeout(() => {
      if (!isAuthenticated) navigate(`/`);
    }, 500);
  }, []);

  const handleCreate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (user && user.email) {
      const id = await createParty(user.email);
      if (id) navigate(`/party/${id}`);
    }
  };

  const handleRedirect = () => {
    if (partyId) navigate(`/party/${partyId}`);
  };

  const confirm = () => {
    setAskConfirm(true);
  };

  const handleDelete = async () => {
    setAskConfirm(false);
    const done = await deleteParty(partyId as string);
    if (done === 'Not Found') {
      return;
    }
    setPartyId('');
    return;
  };
  if (loading) return (
    <DashboardWrapper>
      <Loading />      
    </DashboardWrapper>
  )

  return (
    <DashboardWrapper>
      {!isUp ? (
        <div className="firstHalfDash">
          <h2>Our Server is 📉</h2>
        </div>
      ) : (
        <>
          <div className="firstHalfDash">
            {isAuthenticated ? (
              <div className="hello">
                {' '}
                Hello {(user && user.given_name) || ''}!{' '}
              </div>
            ) : (
              ''
            )}
            {isAuthenticated ? (
              partyId ? (
                <div className="dashButtons">
                  <button className="mainButton" onClick={handleRedirect}>
                    GO TO UR PARTY
                  </button>
                  <button
                    className={
                      askConfirm ? 'mainButton invisible' : 'mainButton'
                    }
                    onClick={confirm}
                  >
                    DELETE CURRENT PARTY
                  </button>
                  <div
                    className={
                      askConfirm ? 'askConfirm' : 'invisible askConfirm'
                    }
                  >
                    ARE YOU SURE?
                    <div className="wrapConfirm">
                      <button
                        className="confirmYes vibrate"
                        onClick={handleDelete}
                      >
                        YES
                      </button>
                      <button
                        className="confirmNo"
                        onClick={() => setAskConfirm(false)}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={handleCreate} className="logButton">
                  CREATE A PARTY 📸
                </button>
              )
            ) : (
              ''
            )}
          </div>
          <div className="secondHalfDash"></div>
          {isAuthenticated ? (
            <div className="navButton" onClick={() => logout()}>
              <button className="logButton">LOGOUT</button>
            </div>
          ) : (
            <div
              className="navButton"
              onClick={() => loginWithRedirect()}
            >
              <button className="logButton">LOGIN</button>
            </div>
          )}
        </>
      )}
    </DashboardWrapper>
  );
}

export default Dashboard;
