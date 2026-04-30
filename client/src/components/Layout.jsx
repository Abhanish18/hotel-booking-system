import React from "react";

function Layout({ children, setTab, tab }) {

  const menu = [
    { key: "book", label: "🏨 Book Room" },
    { key: "my", label: "👤 My Bookings" },
    { key: "admin", label: "👨‍💼 Admin Panel" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* 🔥 SIDEBAR */}
      <div style={{
        width: "260px",
        background: "#0a1f44",
        color: "white",
        padding: "30px"
      }}>

        <h2 style={{ marginBottom: "40px" }}>
          🏨 HotelChain
        </h2>

        {menu.map(item => (
          <div
            key={item.key}
            onClick={() => setTab(item.key)}
            style={{
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              background: tab === item.key ? "#d6a84a" : "transparent",
              color: tab === item.key ? "black" : "white"
            }}
          >
            {item.label}
          </div>
        ))}

      </div>

      {/* 🔥 MAIN CONTENT */}
      <div style={{
        flex: 1,
        background: "#f5f6fa",
        padding: "30px"
      }}>
        {children}
      </div>

    </div>
  );
}

export default Layout;