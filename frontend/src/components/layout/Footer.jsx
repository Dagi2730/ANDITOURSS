import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Contact Info</h3>
          <p>+251911661377</p>
          <p>ANDI TOURS</p>
          <p>📍 Addis Ababa, Ethiopia</p>
          <p>Andidagmawit@yahoo.com</p>
        </div>
        <div className="box">
          <h3>Follow Us</h3>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
        </div>
      </div>
      <div className="credit">
        Created by <span>Dagmawit Andargachev</span> | all rights reserved!
      </div>
    </footer>
  );
}

export default Footer;