import React, {useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import AsyncSelect from "react-select/async";

const PopupCreateAlbum = ({onClose}) => {
  const state = useAuth("state");
  const [errorAccept, setErrorAccept] = useState(false);
  const [titleArt, setTitleArt] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    year: 0,
    artist: 0,
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeArt = (selectedOption) => {
    setTitleArt(selectedOption);
    setFormData({
      ...formData,
      artist: selectedOption ? selectedOption.value : 0,
    });
  };

  const onAccept = () => {
    if (formData.title && formData.year) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${state.token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          year: formData.year,
          artist: formData.artist,
        }),
      }).then((response) => {
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

  return (
    <div>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <h2 className="title">Nuevo Album</h2>
          <form
            className="box"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItem:
                "stretch" /* Asegura que los elementos se estiren al ancho disponible */,
              padding: "20px",
              maxWidth: "100%",
            }}
          >
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
                <AsyncSelect
                  loadOptions={loadOptions}
                  value={titleArt}
                  onChange={handleChangeArt}
                  placeholder="Selecciona un artista..."
                  isClearable
                  cacheOptions
                  defaultOptions
                />
              </div>
            </div>
            <div
              className="field"
              style={{display: "flex", justifyContent: "space-between"}}
            >
              <div>
                <button
                  onClick={onAccept}
                  className="button is-primary"
                  type="button"
                >
                  Aceptar
                </button>
              </div>
              <div>
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
              <p>Inserte título y año del álbum.</p>
            )}
            {errorAccept && (
              <p>
                ¡No se puede insertar el álbum! Las credenciales de
                autenticación no se proveyeron.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupCreateAlbum;
