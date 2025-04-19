
import React from "react";
import Home from "./pages/Home";
import Details from "./pages/Details";
import { Routes, Route } from 'react-router-dom';

function RoutesComponent() {
    return (
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:name?" element={<Details />} />
          <Route path="/:query?" element={<Home />} />

        </Routes>
      </div>
    );
  }
  
  export default RoutesComponent;
  



