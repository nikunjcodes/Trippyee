import React from "react";
import "./GetStarted.css";
const GetStarted = () => {
  return (
    <div id="get-start" className="g-wrapp">
      <div className="paddings innerWidth g-contain">
        <div className="flexColCenter inner-contain">
          <span className="primaryText">Get started with Trippyee</span>
          <span className="secondaryText">
            Subscribe and find super attractive places to visit.
            <br />
            Plan your next travel destination.
          </span>
          <button className="button" href>
            <a href="google.com">Get Started</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
