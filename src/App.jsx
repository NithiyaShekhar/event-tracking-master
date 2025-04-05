import React from "react";
import Login from "./Components/Login";
import EventDashboard from "./Components/Dashboard";
import useTracking from "./utils/useTracking";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  useTracking();

  
  return (
    <div>
      <Router>
        <div>
           <h1>Event Tracking App</h1>
           <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<EventDashboard />} />
          </Routes>
        </div>
    </Router>
    </div>
  );
};

export default App;
