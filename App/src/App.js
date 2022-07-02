import React, { useEffect } from 'react';
import Home from "./Pages/Home"
import Booking from "./Pages/Booking"
import Navbar from './Components/HomePage/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Components/Footer';
import Payment from './Pages/payment';


function App() {
  return (
    <div className="App">
      <Booking />
      <Footer />
    </div>
  )
}

export default App;