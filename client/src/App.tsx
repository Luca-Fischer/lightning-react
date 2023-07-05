import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import History from "./Pages/History";
import Connect from "./Pages/Connect";
import Channels from "./Pages/Channels";
import Handling from "./Pages/Handling";
import Box from "@mui/material/Box";

import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Box component="main" sx={{ p: 12 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/History" element={<History />} />
        <Route path="/Connect" element={<Connect />} />
        <Route path="/Channels" element={<Channels />} />
        <Route path="/Handling" element={<Handling />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      </Box>
    </Router>
  );
};

export default App;
