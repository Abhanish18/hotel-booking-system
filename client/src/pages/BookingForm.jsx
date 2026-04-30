 import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import BookingABI from "../abi/Booking.json";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function BookingForm() {

  const [form, setForm] = useState({
    userName: "",
    userEmail: localStorage.getItem("email") || "",
    room: "Deluxe Room",
    checkIn: "",
    checkOut: ""
  });

  const [msg, setMsg] = useState("");
  const [account, setAccount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const pricePerNight = 100;

  const nights =
    form.checkIn && form.checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(form.checkOut) - new Date(form.checkIn)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const total = nights * pricePerNight;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 CONNECT WALLET (UPDATED)
  const connectWallet = async () => {
    try {
      console.log("Button clicked ✅");

      if (!window.ethereum) {
        alert("MetaMask not found! Please install it.");
        return;
      }

      console.log("MetaMask detected ✅");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      console.log("Connected:", accounts[0]);

      setAccount(accounts[0]);

    } catch (err) {
      console.error("Wallet error:", err);
      alert("Connection failed");
    }
  };

  // 🔥 BOOKING FUNCTION
  const submitBooking = async (e) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect wallet first");
      return;
    }

    if (!form.userName || !form.checkIn || !form.checkOut) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMsg("Processing transaction...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        BookingABI,
        signer
      );

      const tx = await contract.bookRoom(
        form.userName,
        form.userEmail,
        form.room,
        total
      );

      setTxHash(tx.hash);

      await tx.wait();

      // Save to backend
      await axios.post("http://localhost:5000/api/bookings", form);

      setMsg("Booking saved in Blockchain + Mongo ✅");

      setForm({
        userName: "",
        userEmail: localStorage.getItem("email") || "",
        room: "Deluxe Room",
        checkIn: "",
        checkOut: ""
      });

    } catch (err) {
      console.error(err);
      setMsg("Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#f5f5f5",
      minHeight: "100vh",
      padding: "40px"
    }}>

      <div style={{
        background: "#0a2667",
        color: "white",
        borderRadius: "30px",
        padding: "50px",
        maxWidth: "900px",
        margin: "auto"
      }}>

        <h1>🏨 Hotel Booking (Blockchain)</h1>

        {/* 🔌 WALLET */}
        <button onClick={connectWallet} style={btnStyle}>
          {account
            ? `Connected: ${account.slice(0, 6)}...`
            : "Connect MetaMask"}
        </button>

        {account && (
          <p style={{ marginTop: "10px" }}>
            Wallet: {account}
          </p>
        )}

        <form onSubmit={submitBooking}>

          <input
            name="userName"
            placeholder="Full Name"
            value={form.userName}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="userEmail"
            value={form.userEmail}
            readOnly
            style={inputStyle}
          />

          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="room"
            value={form.room}
            onChange={handleChange}
            style={inputStyle}
          >
            <option>Deluxe Room</option>
            <option>Suite Room</option>
            <option>Executive Room</option>
          </select>

          <h3>Nights: {nights}</h3>
          <h2>Total: ${total}</h2>

          <button type="submit" style={btnStyle}>
            {loading ? "Processing..." : "Book Now"}
          </button>

        </form>

        {msg && <p style={{ marginTop: "15px" }}>{msg}</p>}

        {txHash && (
          <div style={{
            background: "#0f5132",
            padding: "10px",
            borderRadius: "10px",
            marginTop: "10px"
          }}>
            ✅ TX: {txHash}
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none"
};

const btnStyle = {
  padding: "12px 20px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "none",
  background: "#d6a84a",
  cursor: "pointer"
};

export default BookingForm;