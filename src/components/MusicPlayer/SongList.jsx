import React, {useEffect, useState, useRef} from "react";
import SongCard from "./SongCard";

function SongList() {
  const [page, setPage] = useState(1);
  const [songs, setSongs] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const observerRef = useRef();
  const lastSongElementRef = useRef();

  const doFetch = async () => {
    setIsLoading(true);
    let query = new URLSearchParams({
      page: page,
      page_size: 5,
      ordering: `-created_at`,
      ...filters,
    }).toString();

    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/songs/?${query}`, {})
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setSongs((prevSongs) => [...prevSongs, ...data.results]);
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
    // Si la petición esta en proceso no creamos observador
    if (isLoading) return;

    // Si hay otro observador definido lo desuscribimos
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Creamos y referenciamos el observador de tarjetas actual
    observerRef.current = new IntersectionObserver((cards) => {
      // Observamos todas las tarjetas de la nueva página cargada
      if (cards[0].isIntersecting && nextUrl) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    // Actualizamos la referencia al última tarjeta
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

  if (isError) return <p>Error al cargar las canciones.</p>;
  if (!songs.length && !isLoading) return <p>No hay canciones disponibles</p>;

  return (
    <div>
      <div className="my-5">
        <h2 className="title">Lista de Canciones</h2>
        <form className="box" onSubmit={handleSearch}>
          <div className="field">
            <label className="label">Título:</label>
            <div className="control">
              <input className="input" type="text" name="title" />
            </div>
          </div>
          <div className="field">
            <label className="label">Artista:</label>
            <div className="control">
              <input className="input" type="number" name="artists" />
            </div>
          </div>
          <div className="field">
            <label className="label">Fecha de inicio:</label>
            <div className="control">
              <input
                className="input"
                type="datetime-local"
                name="created_at_min"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Fecha de fin:</label>
            <div className="control">
              <input
                className="input"
                type="datetime-local"
                name="created_at_max"
              />
            </div>
          </div>
          <div className="field">
            <button className="button is-primary" type="submit">
              Buscar
            </button>
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
    </div>
  );
}

export default SongList;
