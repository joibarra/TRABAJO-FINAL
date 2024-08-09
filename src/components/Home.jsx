import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  LinearProgress,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAuth} from "../contexts/AuthContext";
import PopupMsj from "./popup/PopupMsj";
import PopupAlbum from "./popup/PopupAlbum";

export default function Home() {
  const navigate = useNavigate();
  const state = useAuth("state");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupAlbum, setShowPopupAlbum] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState();
  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate("/");
  };
  // Definir las rutas de menú manualmente si no están bajo un padre común
  const menuItems = [
    {path: "/articles", label: "articles"},
    {path: "/songs", label: "songs"},
    {path: "/profile", label: "profile"},
    {path: "/BuscadorDeCanciones", label: "BuscadorDeCanciones"},
  ];

  useEffect(() => {
    const fetchAlbumsAndArtists = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Token ${state.token}`,
            },
          }
        );
        const data = await response.json();
        if (data.results) {
          const albumsWithArtists = await Promise.all(
            data.results.map(async (album) => {
              const artistResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}harmonyhub/artists/${
                  album.artist
                }/`,
                {
                  method: "GET",
                  headers: {
                    accept: "application/json",
                    Authorization: `Token ${state.token}`,
                  },
                }
              );
              const artistData = await artistResponse.json();
              return {...album, artistName: artistData.name};
            })
          );
          setAlbums(albumsWithArtists);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumsAndArtists();
  }, [state.token]);

  const handleEdit = (album) => {
    console.log("album", album);
    setSelectedAlbum(album);
    setShowPopupAlbum(true);
  };

  const handleDelete = (id) => {
    console.log(`Delete album with id: ${id}`);
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/${id}/`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Token ${state.token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        setShowPopup(true);
        setMessage("Las credenciales de autenticación no se proveyeron.");
      } else {
        setShowPopup(true);
        setMessage("El album fue eliminado.");
      }
    });
  };

  const handleView = (album) => {
    console.log(`View album with id: ${album}`);
    setShowPopupAlbum(true);
    // Implementa la lógica de visualización aquí
  };

  function handleClosePopup() {
    setShowPopup(false);
  }

  function handleClosePopupAlbum() {
    setShowPopupAlbum(false);
  }

  return (
    <div style={{display: "flex", height: "100vh"}}>
      <aside style={{width: "200px", background: "#A5FFC9", padding: "10px"}}>
        <nav>
          <ul style={{listStyle: "none", padding: 0}}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={{flex: 1, background: "#222222", padding: "10px"}}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "#61F2B1", fontSize: "24px", fontWeight: "bold"}}>Home</h1>
          <button style={{ color: "#61F2B1", fontWeight: "bold" }} onClick={handleLogout}>Cerrar Sesión</button>
        </header>
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Artist</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Cover</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      padding="none"
                      sx={{
                        "&.MuiTableCell-root": {
                          paddingX: 1,
                        },
                      }}
                    >
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  albums.map((album) => (
                    <TableRow key={album.id}>
                      <TableCell>{album.title}</TableCell>
                      <TableCell>{album.artistName}</TableCell>
                      <TableCell>{album.year}</TableCell>
                      <TableCell>
                        {album.cover ? (
                          <img src={album.cover} alt={album.title} width={50} />
                        ) : (
                          "No cover"
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(album)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(album.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleView(album)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {showPopupAlbum && (
            <PopupAlbum album={selectedAlbum} onClose={handleClosePopupAlbum} />
          )}
          {showPopup && (
            <PopupMsj message={message} onClose={handleClosePopup} />
          )}
        </div>
      </main>
    </div>
  );
}