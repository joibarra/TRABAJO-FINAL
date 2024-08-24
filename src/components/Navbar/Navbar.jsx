import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.jsx";
import { Divider } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <header style={{ backgroundColor: "#aed9e0", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "#61F2B1",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            alignSelf: "flex-end",
            border: "2px solid black",
            fontFamily: "'Segoe UI', sans-serif"
          }}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <nav style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", flexFlow: "column", margin: 10 }}>
          <p>
            <strong>
              <u
                style={{ fontSize: "20px", color: "darkgreen", marginBottom: 15, fontFamily: "'Segoe UI', sans-serif" }}
              >
                Menú
              </u>
            </strong>
          </p>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              fontSize: "30px",
              color: "darkgreen",
              marginRight: "10px",
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            <NavLink
              to="/albums"
              style={{ textDecoration: "none", color: "inherit", fontFamily: "'Segoe UI', sans-serif" }}
            >
              &nbsp;&bull;&nbsp; Albums
            </NavLink>
            <NavLink
              to="/songs"
              style={{ textDecoration: "none", color: "inherit", fontFamily: "'Segoe UI', sans-serif" }}
            >
              &nbsp;&bull;&nbsp; Canciones
            </NavLink>
            <NavLink
              to="/ArtistList"
              style={{ textDecoration: "none", color: "inherit", fontFamily: "'Segoe UI', sans-serif" }}
            >
              &nbsp;&bull;&nbsp; Artistas
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;