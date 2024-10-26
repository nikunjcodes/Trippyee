import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App1 from "./App1.tsx";
import App from "./App.jsx";
import Header from "./components/Header/Header.jsx"
import Cities from  "./components/SearchResults/Cities.tsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonalizedTrip from "./components/PersonalizedTrip/PersonalizedTrip.tsx"
import ItenaryDisplay from "./components/ItenaryDisplay/ItenaryDisplay.tsx"
import MatchingCities from "./components/MatchingCities.tsx"
import TripPlannerForm from "./components/TripPlannerForm.tsx"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>    
    
    <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/plan-trip" element={<><Header /><TripPlannerForm /></>} />
      <Route path="/cities" element={<><Header /><Cities /></>} />
      <Route path = "/personalized-trip" element = {<><Header /><PersonalizedTrip/></>}/>
      <Route path = "/itinerary" element = {<><Header /><ItenaryDisplay/></>}/>
      <Route path = "/matching-cities" element ={<><Header /> <MatchingCities /></>}/>
      </Routes>
    </Router>

  </React.StrictMode>
);
