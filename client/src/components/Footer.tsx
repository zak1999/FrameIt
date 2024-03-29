import React from 'react';
import '../styles/Dashboard.css';

function Footer() {
  return (
    <div className="footer">
      <div className="footerInfo">
        <p>This App is being developed as a personal project.</p>
        <p>Feel free to make contributions or contact me at:</p>
      </div>
      <div className="footerLinks">
        <a id="github" href="https://github.com/Al366io">
          <img
            className="icon"
            src={process.env.PUBLIC_URL + '/assets/githubIcon.png'}
          ></img>
        </a>
        <a
          id="linkedin"
          href="https://www.linkedin.com/in/alessio-nannipieri-a27550218/"
        >
          <img
            className="icon"
            src={process.env.PUBLIC_URL + '/assets/linkedinIcon.png'}
          ></img>
        </a>
      </div>
    </div>
  );
}

export default Footer;
