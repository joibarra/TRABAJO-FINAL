import React, {useEffect, useState, useRef} from "react";
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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PopupAlbum from "../popup/PopupAlbum";
import {useAuth} from "../../contexts/AuthContext";
import PopupMsj from "../popup/PopupMsj";
import PopupCreateAlbum from "../popup/PopupCreateAlbum";
import PopupViewAlbum from "../popup/PopupViewAlbum";
import Navbar from "../Navbar/Navbar";

export default function Albums() {
  const state = useAuth("state");
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupAlbum, setShowPopupAlbum] = useState(false);
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [idAlbumDelete, setIdAlbumDelete] = useState();
  const [showPopupAlter, setShowPopupAlter] = useState(false);
  const [showPopupViewAlbum, setShowPopupViewAlbum] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número de filas por página
  const [totalAlbums, setTotalAlbums] = useState(0); // Total de álbumes para paginación
  const lastSongElementRef = useRef();
  const maxPage = Math.ceil(totalAlbums / rowsPerPage) - 1;
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
    setPage(0);
  }
  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    } else if (page < 0) {
      setPage(0);
    }
    if (totalAlbums === 0) {
      setPage(0);
    }
  }, [totalAlbums, rowsPerPage]);
  useEffect(() => {
    fetchAlbumsAndArtists();
  }, [page, filters, refresh]);
  useEffect(() => {
    if (albums.length === 0 && page !== 0) {
      setPage(0);
    }
  }, [albums, page]);

  const fetchAlbumsAndArtists = async () => {
    setIsLoading(true);
    try {
      let query = new URLSearchParams({
        page: page + 1,
        page_size: 10,
        ordering: `-created_at`,
        ...filters,
      }).toString();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/?${query}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `token ${state.token}`,
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
        //setAlbums(albumsWithArtists);
        setAlbums(albumsWithArtists);
        setTotalAlbums(data.count); // Total de álbumes para la paginación
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    if (newPage >= 0 && newPage <= maxPage) {
      setPage(newPage);
    } else if (newPage < 0) {
      setPage(0); // Asegurarse de que la página no sea negativa
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
            "Content-Type": "application/json",
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
          setAlbums([]);
          setRefresh((prev) => !prev); // Actualiza el estado para forzar la recarga
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
    setAlbums([]);
    setRefresh((prev) => !prev); //
  }
  function handleClosePopupCreate() {
    setShowPopupCreate(false);
    setAlbums([]);
    setRefresh((prev) => !prev); //
  }
  function handleClosePopupViewAlbum() {
    setShowPopupViewAlbum(false);
  }

  return (
    <div style={{display: "flex"}}>
      <Navbar />
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
              color: "#b8f2e6",
              fontSize: "40px",
              fontWeight: "bold",
              marginLeft: "15px",
            }}
          >
            Lista de Albumes
          </h1>
        </header>
        <form className="box" onSubmit={handleSearch}>
          <div
            style={{
              display: "flex",
              color: "#b8f2e6",
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
                    <TableCell colSpan={6} padding="none">
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  albums.map((album, index) => (
                    <TableRow
                      key={album.id}
                      ref={
                        index === albums.length - 1 ? lastSongElementRef : null
                      }
                    >
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
          <TablePagination
            component="div"
            count={totalAlbums}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Álbumes por página"
            labelDisplayedRows={({from, to, count}) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            style={{backgroundColor: "white"}}
          />
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
