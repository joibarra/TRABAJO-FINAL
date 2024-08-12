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
import PopupAlbum from "../popup/PopupAlbum";
import {useAuth} from "../../contexts/AuthContext";
import PopupMsj from "../popup/PopupMsj";
import PopupCreateAlbum from "../popup/PopupCreateAlbum";
import PopupViewAlbum from "../popup/PopupViewAlbum";

export default function Albums() {
  const navigate = useNavigate();
  const state = useAuth("state");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupAlbum, setShowPopupAlbum] = useState(false);
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [idAlbumDelete, setIdAlbumDelete] = useState();
  const [showPopupAlter, setShowPopupAlter] = useState(false);
  const [showPopupViewAlbum, setShowPopupViewAlbum] = useState(false);

  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate("/");
  };
  // Definir las rutas de menú manualmente si no están bajo un padre común
  const menuItems = [
    {key: 1, path: "/albums", label: "Album"},
    {key: 2, path: "/songs", label: "Canciones"},
    {key: 3, path: "/ArtistList", label: "Artistas"},
    //  {path: "/BuscadorDeCanciones", label: "BuscadorDeCanciones"},
  ];
  const addAlbum = () => {
    setShowPopupCreate(true);
  };
  function handleSearch(event) {
    event.preventDefault();

    const searchForm = new FormData(event.target);

    const newFilters = {};
    searchForm.forEach((value, key) => {
      if (value) {
        newFilters[key] = value;
      }
    });

    setFilters(newFilters);
    setAlbums([]);
    setPage(1);
  }

  const doFetch = async () => {
    setIsLoading(true);
    let query = new URLSearchParams({
      page: page,
      page_size: 5,
      ordering: `-created_at`,
      ...filters,
    }).toString();
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/?${query}`, {})
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setAlbums((prevAlbums) => [...prevAlbums, ...data.results]);
          setNextUrl(data.next);
        }
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    doFetch();
  }, [page, filters]);

  useEffect(() => {
    setShowPopupAlter(false);
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
    setSelectedAlbum(album);
    setShowPopupAlbum(true);
  };

  const handleDelete = (id) => {
    setShowPopupAlter(false);
    setIdAlbumDelete(id);
    setShowPopup(true);
    setMessage("¿Seguro que desea eliminar el album?.");
  };

  const handleView = (album) => {
    console.log(`View album with id: ${album}`);
    setSelectedAlbum(album);
    setShowPopupViewAlbum(true);
  };

  function handleConfigPopup() {
    if (!showPopupAlter) {
      fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }harmonyhub/albums/${idAlbumDelete}/`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Token ${state.token}`,
          },
        }
      ).then((response) => {
        if (!response.ok) {
          setShowPopup(true);
          setMessage("Sólo el propietario puede eliminar este álbum.");
          setShowPopupAlter(true);
        } else {
          setShowPopup(true);
          setMessage("El album fue eliminado.");
          setShowPopupAlter(true);
        }
      });
    } else {
      setShowPopup(false);
    }
  }

  function handleClosePopup() {
    setShowPopup(false);
  }
  function handleClosePopupAlbum() {
    setShowPopupAlbum(false);
  }

  function handleClosePopupCreate() {
    setShowPopupCreate(false);
  }
  function handleClosePopupViewAlbum() {
    setShowPopupViewAlbum(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "200px", background: "#A5FFC9", padding: "10px" }}>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
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
            marginBottom: "10px",
          }}
        >
          <h1
            style={{
              color: "#61F2B1",
              fontSize: "40px",
              fontWeight: "bold",
              marginLeft: "15px",
            }}
          >
            Albums
          </h1>
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#333",
              color: "#61F2B1",
              border: "none",
              borderRadius: "5px",
              cursor: "#61F2B1",
              alignSelf: "flex-end",
              border: "2px solid black",
            }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </header>
        <form className="box" onSubmit={handleSearch}>
          <div
            style={{
              display: "flex",
              color: "#61F2B1",
              justifyContent: "space-around",
            }}
          >
            <div className="control">
              <label className="label">Título:</label>
              <input className="input" type="text" name="title" />
            </div>
            <div className="control">
              <label className="label">Artista:</label>
              <input className="input" type="text" name="<artist>" />
            </div>
            <div className="control">
              <label className="label">Año:</label>
              <input className="input" type="text" name="year" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "15px",
            }}
          >
            <div className="control">
              <button
                type="submit"
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
                }}
              >
                Buscar
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                onClick={addAlbum}
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
                }}
              >
                Agregar album
              </button>
            </div>
          </div>
        </form>

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
          {showPopupViewAlbum && (
            <PopupViewAlbum
              album={selectedAlbum}
              onClose={handleClosePopupViewAlbum}
            />
          )}
          {showPopup && (
            <PopupMsj
              message={message}
              onConfirm={handleConfigPopup}
              onClose={handleClosePopup}
            />
          )}
          {showPopupCreate && (
            <PopupCreateAlbum onClose={handleClosePopupCreate} />
          )}
        </div>
      </main>
    </div>
  );
}
 
