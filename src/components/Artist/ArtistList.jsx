import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SongCard from "./SongCard";
import PopupSongs from "../popup/PopupSongs";

function ArtistList() {
  const [page, setPage] = useState(1);
  const [songs, setSongs] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const observerRef = useRef();
  const lastSongElementRef = useRef();
  const navigate = useNavigate();

  const doFetch = async () => {
    setIsLoading(true);
    let query = new URLSearchParams({
      page: page,
      page_size: 5,
      ordering: `-created_at`,
      ...filters,
    }).toString();

    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/artist/?${query}`, {})
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setArtists((prevArtists) => [...prevArtists, ...data.results]);
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
    if (isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((cards) => {
      if (cards[0].isIntersecting && nextUrl) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastSongElementRef.current) {
      observerRef.current.observe(lastSongElementRef.current);
    }
  }, [isLoading, nextUrl]);

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
    setSongs([]);
    setPage(1);
  }

  function handleBack() {
    navigate("/albums");
  }

  function handleAdd() {
    setSelectedArtist({ name: "", bio: "", website: "", created_at_min: "", created_at_max: "" });
    setIsPopupVisible(true);
  }

  function handlePopupClose() {
    setIsPopupVisible(false);
   
  }

  if (isError) return <p>Error al cargar las canciones.</p>;
  if (!songs.length && !isLoading) return <p>No hay canciones disponibles</p>;

  return (
    <div style={{ backgroundColor: "hsl(141, 100%, 82%)", padding: "20px" }}>
      <div className="my-5">
        <h2 className="title">Lista de artistas</h2>
        <form className="box" onSubmit={handleSearch}>
          <div className="field is-grouped">
            <div className="control">
              <label className="label">Nombre:</label>
              <input className="input" type="text" name="name" />
            </div>
            <div className="control">
              <label className="label">Biografia:</label>
              <input className="input" type="text" name="album" />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <label className="label">Página web:</label>
              <input className="input" type="text" name="artist" />
            </div>
            <div className="control">
              <label className="label">Fecha de creación a partir de:</label>
              <input className="input" type="text" name="genre" />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <label className="label">Fecha de creacion hasta:</label>
              <input className="input" type="text" name="year" />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-primary" type="submit" style={{ marginRight: "10px" }}>
                Buscar
              </button>
            </div>
            <div className="control">
              <button className="button is-success" type="button" onClick={handleAdd} style={{ marginRight: "10px" }}>
                Agregar
              </button>
            </div>
            <div className="control">
              <button className="button is-warning" type="button" onClick={handleBack}>
                Atrás
              </button>
            </div>
          </div>
        </form>
        <ul>
          {songs.map((song, index) => {
            if (songs.length === index + 1) {
              return (
                <div
                  key={song.id}
                  ref={lastSongElementRef}
                  className="column is-two-thirds"
                >
                  <SongCard song={song} />
                </div>
              );
            } else {
              return (
                <div key={song.id} className="column is-two-thirds">
                  <SongCard song={song} />
                </div>
              );
            }
          })}
        </ul>
        {isLoading && <p>Cargando más canciones...</p>}
      </div>
      {isPopupVisible && (
        <PopupSongs onClose={handlePopupClose}/>
      )}
    </div>
  );
}

export default SongList;