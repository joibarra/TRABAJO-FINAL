import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import ArtistCard from "./ArtistCard";
import PopupArtists from "../popup/PopupArtists";
import Navbar from "../Navbar/Navbar";

function ArtistList() {
  const [page, setPage] = useState(1);
  const [artists, setArtists] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const observerRef = useRef();
  const lastArtistElementRef = useRef();
  const navigate = useNavigate();

  const doFetch = async () => {
    setIsLoading(true);
    let query = new URLSearchParams({
      page: page,
      page_size: 5,
      ordering: `-created_at`,
      ...filters,
    }).toString();
    console.log("query>>", query);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}harmonyhub/artists/?${query}`,
      {}
    )
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
  }, [page, filters, refresh]);

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

    if (lastArtistElementRef.current) {
      observerRef.current.observe(lastArtistElementRef.current);
    }
  }, [isLoading, nextUrl]);

  function handleSearch(event) {
    event.preventDefault();
    console.log(event.target);
    const searchForm = new FormData(event.target);

    const newFilters = {};

    searchForm.forEach((value, key) => {
      if (value) {
        newFilters[key] = value;
      }
    });

    setFilters(newFilters);
    setArtists([]);
    setPage(1);
  }

  function handleBack() {
    navigate("/albums");
  }

  function handleAdd() {
    setIsPopupVisible(true);
  }

  function handlePopupClose() {
    setIsPopupVisible(false);
    setArtists([]);
    setRefresh((prev) => !prev);
  }

  if (isError) return <p>Error al cargar los artistas.</p>;
  if (!artists.length && !isLoading) return <p>No hay artistas disponibles</p>;

  return (
    <div style={{display: "flex"}}>
      <Navbar />
      <div
        style={{
          flex: 1,
          backgroundColor: "hsl(141, 100%, 82%)",
          padding: "10px",
        }}
      >
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
              color: "#5e6472",
              fontSize: "40px",
              fontWeight: "bold",
              marginLeft: "15px",
            }}
          >
            Lista de Artistas
          </h1>
        </header>
        <form className="box" onSubmit={handleSearch}>
          <div style={{display: "flex", gap: 15, justifyContent: "center"}}>
            <div className="control">
              <label className="label">Nombre:</label>
              <input className="input" type="text" name="name" />
            </div>
            <div className="control">
              <label className="label">Biografia:</label>
              <input className="input" type="text" name="bio" />
            </div>
          </div>
          <div style={{display: "flex", gap: 15, justifyContent: "center"}}>
            <div className="control">
              <label className="label">Página web:</label>
              <input className="input" type="text" name="website" />
            </div>
            <div className="control">
              <label className="label">Fecha de creación a partir de:</label>
              <input className="input" type="text" name="created_at_min" />
            </div>
          </div>
          <div style={{display: "flex", gap: 15, justifyContent: "center"}}>
            <div className="control">
              <label className="label">Fecha de creacion hasta:</label>
              <input className="input" type="text" name="created_at_max" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 15,
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <div className="control">
              <button
                className="button is-primary"
                type="submit"
                style={{marginRight: "10px"}}
              >
                Buscar
              </button>
            </div>
            <div className="control">
              <button
                className="button is-success"
                type="button"
                onClick={handleAdd}
                style={{marginRight: "10px"}}
              >
                Agregar
              </button>
            </div>
            <div className="control">
              <button
                className="button is-warning"
                type="button"
                onClick={handleBack}
              >
                Atrás
              </button>
            </div>
          </div>
        </form>
        <ul>
          {artists.map((artist, index) => {
            if (artists.length === index + 1) {
              return (
                <div
                  key={artist.id}
                  ref={lastArtistElementRef}
                  className="column"
                >
                  <ArtistCard artist={artist} />
                </div>
              );
            } else {
              return (
                <div key={artist.id} className="column">
                  <ArtistCard artist={artist} />
                </div>
              );
            }
          })}
        </ul>
        {isLoading && <p>Cargando más artistas...</p>}
        {isPopupVisible && (
          <PopupArtists onClose={handlePopupClose} />
        )}
      </div>
    </div>
  );
}

export default ArtistList;