import React from "react";
import {Link} from "react-router-dom";
import Albums from "./Album/Albums";

function Home() {
  const menuItems = [
    {key: 1, path: "/albums", label: "Album"},
    {key: 2, path: "/songs", label: "Canciones"},
    {key: 3, path: "/ArtistList", label: "Artistas"},
  ];

  return (
    <div style={{display: "flex", height: "100vh"}}>
      <aside style={{width: "200px", background: "#A5FFC9", padding: "10px"}}>
        <nav>
          <ul style={{listStyle: "none", padding: 0}}>
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main
        style={{
          flex: 1,
          background: "#222222",
          padding: "10px",
          color: "white",
        }}
      >
        <Albums />
      </main>
    </div>
  );
}
export default Home;
