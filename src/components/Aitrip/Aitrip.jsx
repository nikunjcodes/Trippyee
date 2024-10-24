import React from "react";
import "./Aitrip.css";
const Aitrip = () => {
  return (
    <div id="Ai-trip" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primText">LET AI PLAN YOUR TRIP</span>
          <span className="secondText">
          Let AI design your dream vacation, customized to your preferences
            <br />
            {/* Plan your next travel destination. */}
          </span>
          <button className="button">
            <a href="/plan-trip">Get Started</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aitrip;
