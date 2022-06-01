import React, { useEffect } from 'react';
import Home from "./Pages/Home"
import Booking from "./Pages/Booking"
import Navbar from './Components/HomePage/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Booking />
    </div>
  )
}

export default App;