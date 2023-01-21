import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import '../styles/Dashboard.css';

function NoPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <div id="errorContainer">
        <h3 id="errorHead">404</h3>
        <h3 id="errorSubhead">You're looking for the wrong party</h3>
        <Link to="/" id="errorBackHome">
          Go Back Home ?
        </Link>
      </div>
    </>
  );
}

export default NoPage;
