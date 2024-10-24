// src/components/PlanTrip/BudgetSelection.jsx
import React from "react";
import './PlanTrip.css';

const BudgetSelection = ({ budget, setBudget, openModal }) => {
  return (
    <div>
      <h2>The Budgeting Blueprint</h2>
      <div className="budget-options">
        {["Low", "Medium", "High"].map((option) => (
          <div
            key={option}
            className={`budget-option ${budget === option ? "selected" : ""}`}
            onClick={() => setBudget(option)}
          >
            {option}
          </div>
        ))}
      </div>
      
      {/* Plan Trip Button */}
      <button className="plan-trip-button" onClick={openModal}>
        Plan Trip
      </button>
    </div>
  );
};

export default BudgetSelection;
