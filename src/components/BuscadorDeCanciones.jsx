import React from "react";

export default function BuscadorDeCanciones() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "hsl(141, 100%, 82%)", fontFamily: "Arial, sans-serif", backgroundAttachment: "fixed" }}>
      {/* Sidebar */}
      <aside style={{ width: "15%", padding: "20px", backgroundColor: "#f0f0f0", boxShadow: "2px 0 5px rgba(0,0,0,0.1)", borderRight: "2px solid black" }}>
        <nav>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}><a href="/albums" style={{ textDecoration: "none", color: "#333", borderBottom: "1px solid black" }}>Lista</a></li>
            <li style={{ marginBottom: "10px" }}><a href="/songs" style={{ textDecoration: "none", color: "#333", borderBottom: "1px solid black" }}>Canciones</a></li>
            <li><a href="/profile" style={{ textDecoration: "none", color: "#333", borderBottom: "1px solid black" }}>Perfil</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#fff", borderBottom: "2px solid black" }}>Music Box</h1>
          <button onClick={() => alert("Cerrar sesión")} style={{ padding: "10px 20px", backgroundColor: "#ff4d4d", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", border: "2px solid black" }}>Cerrar Sesión</button>
        </header>

        {/* Search form */}
        <form style={{ display: "flex", flexDirection: "column", marginBottom: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", border: "2px solid black" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <label style={{ flex: 1, marginRight: "10px" }}>
              Título:
              <input type="text" name="title" style={{ marginLeft: "10px", width: "calc(100% - 20px)", padding: "5px", border: "1px solid black" }} />
            </label>
            <label style={{ flex: 1, marginRight: "10px" }}>
              Álbum:
              <input type="text" name="album" style={{ marginLeft: "10px", width: "calc(100% - 20px)", padding: "5px", border: "1px solid black" }} />
            </label>
            <label style={{ flex: 1 }}>
              Artista:
              <input type="text" name="artist" style={{ marginLeft: "10px", width: "calc(100% - 20px)", padding: "5px", border: "1px solid black" }} />
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label style={{ flex: 1, marginRight: "10px" }}>
              Género:
              <input type="text" name="genre" style={{ marginLeft: "10px", width: "calc(100% - 20px)", padding: "5px", border: "1px solid black" }} />
            </label>
            <label style={{ flex: 1, marginRight: "10px" }}>
              Año:
              <input type="text" name="year" style={{ marginLeft: "10px", width: "calc(100% - 20px)", padding: "5px", border: "1px solid black" }} />
            </label>
            <label style={{ flex: 1 }}>
              Creado por:
              <input type="text" name="createdBy" style={{ marginLeft: "10px", width: "calc(100% - 20px)", padding: "5px", border: "1px solid black" }} />
            </label>
          </div>
          <button type="submit" style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", alignSelf: "flex-end", border: "2px solid black" }}>Buscar</button>
        </form>

        {/* Song list */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ backgroundColor: "#333", padding: "10px", color: "white", marginBottom: "10px", borderRadius: "5px", border: "2px solid black" }}>
            <p>Pollera Amarilla</p>
            <audio controls style={{ width: "100%" }}>
              <source src="song1.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div style={{ backgroundColor: "#333", padding: "10px", color: "white", marginBottom: "10px", borderRadius: "5px", border: "2px solid black" }}>
            <p>Pollera Amarilla</p>
            <audio controls style={{ width: "100%" }}>
              <source src="song2.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div style={{ backgroundColor: "#333", padding: "10px", color: "white", marginBottom: "10px", borderRadius: "5px", border: "2px solid black" }}>
            <p>Entre nosotros</p>
            <audio controls style={{ width: "100%" }}>
              <source src="song3.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => alert("Agregar")} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", border: "2px solid black" }}>Agregar</button>
          <button onClick={() => alert("Atras")} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", border: "2px solid black" }}>Atras</button>
        </div>
      </main>
    </div>
  );
}