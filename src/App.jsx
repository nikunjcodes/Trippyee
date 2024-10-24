import React from "react";
import "./App.css";
import Companies from "./components/Companies/Companies";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import GetStarted from "./components/GetStarted/GetStarted";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Residencies from "./components/Residencies/Residencies";
import More from "./components/More/More";
import Value from "./components/Value/Value";
import Stories from "./components/Stories/stories"
import Aitrip from "./components/Aitrip/Aitrip";
import App1 from "./App1";
function App() {
  return (
    
      <div className="App">
        <div>
          <div className="white-gradient" />
          <Header />
          <Hero/>
        
        </div>
        <Aitrip/>
        <Companies />
        <Residencies />
        <More/>
        <Value />
        <Stories/>
        <Contact />
        <GetStarted />
        <Footer />
      </div>
    
  
  );
}

export default App;
