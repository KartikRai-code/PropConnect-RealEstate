import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Buy from './pages/Buy';
import Rent from './pages/Rent';
import Sell from './pages/Sell';
import ListProperty from './pages/ListProperty';
import BecomeAgent from './pages/BecomeAgent';
import PropertyDetails from './pages/PropertyDetails';
import AgentVerificationSuccess from './pages/AgentVerificationSuccess';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/become-agent" element={<BecomeAgent />} />
            <Route path="/agent-verification-success" element={<AgentVerificationSuccess />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 