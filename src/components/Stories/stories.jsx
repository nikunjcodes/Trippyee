import React from "react";
import "./stories.css"; // Ensure you have the right styles imported

const Value = () => {
  return (
    <section id="value" className="v-wrapp">
      <div className="paddin innerWidt flexCente v-contain">
        {/* left side */}
        <div className="v-lef">
          <div className="image-contain">
            <img src="./wtir.jpg" alt="Family" />
            <button className="bottom-left-butto">Share Now</button>
          </div>
        </div>

        {/* right side */}
        <div className="flexColStar v-righ">
          <div className="story-section">
            <h3>Share Your Adventures!</h3>
            <p>
              We believe every journey has a story to tell. Whether it's a
              breathtaking view, a cultural experience, or a moment of joy, we
              want to hear about it. Share your unforgettable travel memories
              and inspire others to explore the world. Your stories could spark
              someone else's next adventure!
            </p>
            <p>
              Tell us where you've been, what you loved, and why it's a must-see
              destination.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Value;
