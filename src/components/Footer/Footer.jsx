import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
     

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">Nagpur,IT Square</span>
          <div className="flexCenter f-menu">
            <span>Querry</span>
            <span>Services</span>
            
            <span>About Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
