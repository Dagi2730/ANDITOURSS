import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Contact Info</h3>
          <p>+251911661377</p>
          <p>+251901592929</p>
          <p>DOBI TOURS</p>
          <p>📍 Addis Ababa, Ethiopia</p>
          <p>dobitoursethiopia@gmail.com</p>
        </div>
        <div className="box">
          <h3>Follow Us</h3>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
        </div>
      </div>
      <div className="credit">
        Created by <span><a href="https://www.linkedin.com/in/dagmawit-andargachew/" target="_blank" rel="noopener noreferrer">Dagmawit Andargachew</a></span> | all rights reserved!
      </div>
    </footer>
  );
}

export default Footer;