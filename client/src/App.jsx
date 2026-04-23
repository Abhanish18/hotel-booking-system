 import React, { useMemo, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  FaHotel,
  FaShieldAlt,
  FaHeadset,
  FaTag,
  FaCalendarAlt,
  FaEnvelope,
  FaUser
} from "react-icons/fa";

export default function App() {
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    room: "Deluxe Room",
    checkIn: "",
    checkOut: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;

    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return 0;
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((end - start) / millisecondsPerDay);
  }, [form.checkIn, form.checkOut]);

  const pricePerNight = 100;
  const totalPrice = nights * pricePerNight;

  const handleBook = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const res = await axios.post("http://localhost:5000/api/bookings", {
        userName: form.userName,
        userEmail: form.userEmail,
        room: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut
      });

      setMessage(res.data?.message || "Booked successfully");
      setMessageType("success");

      setForm({
        userName: "",
        userEmail: "",
        room: "Deluxe Room",
        checkIn: "",
        checkOut: ""
      });
    } catch (err) {
      console.log("FULL BOOKING ERROR:", err);
      console.log("ERROR RESPONSE:", err?.response);
      console.log("ERROR CODE:", err?.code);

      if (err.code === "ERR_NETWORK") {
        setMessage("Cannot connect to backend server on localhost:5000");
      } else {
        setMessage(err.response?.data?.message || err.message || "Booking failed");
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <FaHotel />
          </div>
          <div>
            <h2>HOTEL BOOKING</h2>
            <p>Comfort Stays</p>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#hero">Home</a>
          <a href="#booking">Rooms</a>
          <a href="#booking">My Bookings</a>
          <a href="#features">About Us</a>
        </nav>

        <button className="login-btn" type="button">
          Login
        </button>
      </header>

      <section className="hero" id="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Book Your Perfect Stay</h1>
            <h3>Comfort, Luxury & Memories</h3>
            <p>
              Find and book the best hotels at the best prices.
              <br />
              Your comfort is our priority.
            </p>
          </div>
        </div>
      </section>

      <section className="booking-card" id="booking">
        <div className="booking-left">
          <div className="booking-title-row">
            <div className="booking-icon">
              <FaHotel />
            </div>
            <div>
              <h2>Book Your Room</h2>
              <p>Fill in the details below to book your stay</p>
            </div>
          </div>

          <div className="booking-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-box">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-box">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.userEmail}
                  onChange={(e) =>
                    setForm({ ...form, userEmail: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Check-in Date</label>
              <div className="input-box">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="date"
                  value={form.checkIn}
                  onChange={(e) =>
                    setForm({ ...form, checkIn: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <div className="input-box">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="date"
                  value={form.checkOut}
                  onChange={(e) =>
                    setForm({ ...form, checkOut: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <div className="input-box">
                <FaHotel className="input-icon" />
                <select
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                >
                  <option>Deluxe Room</option>
                  <option>Suite Room</option>
                  <option>Luxury Room</option>
                </select>
              </div>
            </div>

            <div className="form-group summary-box">
              <label>Booking Summary</label>
              <div className="summary-content">
                <p><strong>Price per night:</strong> ${pricePerNight}</p>
                <p><strong>Nights:</strong> {nights}</p>
                <p><strong>Total price:</strong> ${totalPrice}</p>
              </div>
            </div>
          </div>

          {message && (
            <p className={`message ${messageType === "success" ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </div>

        <div className="booking-right">
          <div className="side-icon">
            <FaHotel />
          </div>
          <h3>Best Price Guarantee</h3>
          <p>Get the best deals for your perfect stay.</p>
          <button
            className="book-btn"
            type="button"
            onClick={handleBook}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </section>

      <section className="features-section" id="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaHotel />
            </div>
            <h3>Luxury Rooms</h3>
            <p>Experience the best comfort with our luxury rooms.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaTag />
            </div>
            <h3>Best Prices</h3>
            <p>Get the most affordable prices for top-rated hotels.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Safe & Secure</h3>
            <p>Your safety and security are our top priority.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <h3>24/7 Support</h3>
            <p>We are here to help you anytime, anywhere.</p>
          </div>
        </div>
      </section>
    </div>
  );
}