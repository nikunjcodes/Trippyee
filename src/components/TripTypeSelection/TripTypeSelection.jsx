// src/components/PlanTrip/TripTypeSelection.jsx
import React from "react";
import './TripTypeSelection.css';

const TripTypeSelection = ({ tripType, setTripType, numMembers, setNumMembers, openModal }) => {
  const handleNumMembersChange = (e) => {
    const value = e.target.value;
    if (value < 1) {
      openModal("Number of members must be at least 1."); // Trigger modal for invalid input
    } else {
      setNumMembers(value);
    }
  };

  return (
    <div className="trip-selection-container"> {/* Add the class here */}
      <h2>What kind of trip are you planning?</h2>
      <div className="trip-options">
        {["Solo Trip", "Partner trip", "Friends Trip", "Family trip"].map((type) => (
          <div
            key={type}
            className={`trip-option ${tripType === type ? "selected" : ""}`}
            onClick={() => setTripType(type)}
          >
            {type}
          </div>
        ))}
      </div>

      {/* Conditional Input for Number of Members */}
      {(tripType === "Family trip" || tripType === "Friends Trip") && (
        <div className="num-members-container">
          <label htmlFor="num-members">Number of members:</label>
          <input
            id="num-members"
            type="number"
            min="1"
            value={numMembers}
            onChange={handleNumMembersChange} // Use the new handler
            className="num-members-input"
          />
        </div>
      )}
    </div>
  );
};

export default TripTypeSelection;
