import React from "react";
import {useNavigate} from "react-router-dom";

export default function Article() {
  const navigate = useNavigate();
  const addArticle = () => {
    navigate("/articles/add");
  };

  return (
    <div style={{display: "flex", height: "100vh"}}>
      <main style={{flex: 1, padding: "10px"}}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Articulos</h1>
        </header>
        <button onClick={addArticle}>Agregar articulo</button>
        <div>{/* Contenido principal del Home */}</div>
      </main>
    </div>
  );
}
