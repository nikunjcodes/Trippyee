import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App1 from "./App1.tsx";
import App from "./App.jsx";
import Header from "./components/Header/Header.jsx"
import Cities from  "./components/SearchResults/Cities.tsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/plan-trip" element={<><Header /><App1 /></>} />
      <Route path="/cities" element={<Cities />} />
      </Routes>
    </Router>

  </React.StrictMode>
);
