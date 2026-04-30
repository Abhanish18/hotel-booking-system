 import React, { useState } from "react";
import Layout from "../components/Layout";

import BookingForm from "./BookingForm";
import MyBookings from "./MyBookings";
import AdminDashboard from "./AdminDashboard";

function Home() {

  const [tab, setTab] = useState("book");

  const role = localStorage.getItem("role"); // admin / user

  return (
    <Layout setTab={setTab} tab={tab}>

      {/* 🔥 ROLE CONTROL */}
      {tab === "book" && <BookingForm />}

      {tab === "my" && <MyBookings />}

      {tab === "admin" && role === "admin" && (
        <AdminDashboard />
      )}

      {tab === "admin" && role !== "admin" && (
        <h2>❌ Access Denied</h2>
      )}

    </Layout>
  );
}

export default Home;