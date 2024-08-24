import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import AsyncSelect from "react-select/async";
const PopupAlbum = ({album, onClose}) => {
  const state = useAuth("state");
  const [errorAccept, setErrorAccept] = useState(false);
  const [formData, setFormData] = useState({
    title: album.title,
    year: album.year,
    artist: album.artist,
    artistName: album.artistName,
  });
  console.log("album", formData);
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const OnAccept = (e) => {
    if (formData && formData.title && formData.year && formData.artist) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/${album.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${state.token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            year: formData.year,
            artist: formData.artist,
          }),
        }
      ).then((response) => {
        if (response.ok) {
          onClose();
        } else {
          setErrorAccept(true);
        }
      });
    }
  };

  const loadOptions = (inputValue, callback) => {
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }harmonyhub/artists/?name=${inputValue}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Token ${state.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const options = data.results.map((artist) => ({
          value: artist.id,
          label: artist.name,
        }));
        callback(options);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
      });
  };

  const handleChangeArt = (selectedOption) => {
    console.log("handleChangeArt", selectedOption);
    setFormData({
      ...formData,
      artist: selectedOption ? selectedOption.value : 0,
      artistName: selectedOption ? selectedOption.label : "",
    });
  };
  return (
    <div>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <h2 className="title">Album</h2>
          <form className="box" style={{height: "auto"}}>
            <div className="field">
              <label className="label">Título:</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="title"
                  value={formData.title}
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
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Artista:</label>
              <div className="control">
                <AsyncSelect
                  loadOptions={loadOptions}
                  value={formData.artistName}
                  onChange={handleChangeArt}
                  placeholder={
                    formData.artistName
                      ? formData.artistName
                      : "Selecciona un artista..."
                  }
                  isClearable
                  cacheOptions
                  defaultOptions
                />
              </div>
            </div>
            <div style={{marginBottom: "10px"}}>
              {errorAccept && (
                <p>
                  No puede insertar album! Las credenciales de autenticación no
                  se proveyeron.
                </p>
              )}
            </div>

            <div
              className="field"
              style={{display: "flex", justifyContent: "space-between"}}
            >
              <button
                className="button is-primary"
                type="button"
                onClick={OnAccept}
              >
                Aceptar
              </button>
              <button
                className="button is-primary"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupAlbum;
