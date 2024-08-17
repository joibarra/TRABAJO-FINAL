import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";

const PopupCreateAlbum = ({onClose}) => {
  const state = useAuth("state");
  const [artists, setArtists] = useState([]);
  const [errorAccept, setErrorAccept] = useState(false);
  const [formData, setFormData] = useState({
    title: artists.title,
    year: artists.year,
    artist: artists.id,
  });
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onAccept = () => {
    if (formData.title && formData.year) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${state.token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          year: formData.year,
          artist: formData.artist,
        }),
      }).then((response) => {
        if (response.ok){onClose()}
        if (response.status == 401) {
          setErrorAccept(true);
        }else onClose ()
      });
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setArtists(data.results);
        }
      });
  }, []);

  return (
    <div>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <h2 className="title">Nuevo Album</h2>
          <form className="box">
            <div className="field">
              <label className="label">Título:</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="title"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Año:</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="year"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Artista:</label>
              <div className="control">
                <div className="select">
                  <select name="artist" onChange={handleChange}>
                    {artists.map((artists) => (
                      <option key={artists.id} value={artists.id}>
                        {artists.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div
              className="field"
              style={{display: "flex", justifyContent: "space-between"}}
            >
              <div>
                {" "}
                <button
                  onClick={onAccept}
                  className="button is-primary"
                  type="button"
                >
                  Aceptar
                </button>
              </div>
              <div>
                {" "}
                <button
                  type="button"
                  onClick={onClose}
                  className="button is-primary"
                >
                  Cancelar
                </button>
              </div>
            </div>
            {(!formData.title || !formData.year) && (
              <p>Inserte titulo y año del album.</p>
            )}
            {errorAccept && (
              <p>
                No puede insertar album! Las credenciales de autenticación no se
                proveyeron.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupCreateAlbum;
