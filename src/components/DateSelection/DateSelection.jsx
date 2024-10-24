// src/components/PlanTrip/DateSelection.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DateSelection.css'; // Import the new CSS file

const DateSelection = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="calendar-container">
      <div className="calendar">
        <label htmlFor="start-date">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="MMMM d, yyyy"
          inline // Render the calendar inline
          className="custom-calendar"
        />
      </div>
      <div className="calendar">
        <label htmlFor="end-date">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date(startDate?.getTime() + 7 * 24 * 60 * 60 * 1000)}
          dateFormat="MMMM d, yyyy"
          inline // Render the calendar inline
          className="custom-calendar"
        />
      </div>
    </div>
  );
};

export default DateSelection;
