import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./Pages/Home"
import Booking from "./Pages/Booking";
import Navbar from './Components/HomePage/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Components/Footer';
import SuccessPayment from "./Components/BookingPage/successfulPayment";
import FailedPayment from "./Components/BookingPage/failedPayment";

function App() {
  return (
    <div className="App">
      < Navbar />
      <Router>
        <Routes>
          <Route path="/inicio" element={ <Home /> } />
          <Route path="/reservar" element={ <Booking /> } />
          <Route path="/pagorealizado" element={ <SuccessPayment /> } />
          <Route path="/pagonorealizado" element={ <FailedPayment /> } />
        </Routes>
      </Router>
      < Footer />
    </div>
  )
}

export default App;