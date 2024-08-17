import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";

const PopupSongs = ({onClose}) => {
  const state = useAuth("state");
  const [songs, setSongs] = useState([]);
  const [errorAccept, setErrorAccept] = useState(false);
  const [songFile, setSongFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    album: "",
    song_file: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        song_file: file,
      });
    }
  };

  const onAccept = () => {
    if (formData.title && formData.year && formData.song_file) {
      const formDataSong = new FormData();
      formDataSong.append("title", formData.title);
      formDataSong.append("year", formData.year);
      formDataSong.append("album", parseInt(formData.album, 10));
      formDataSong.append("song_file", formData.song_file);
      setUploading(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/songs/`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Token ${state.token}`,
        },
        body: formDataSong,
      })
        .then((response) => response.json())
        .then((data) => {
          setUploading(false);
          if (data && data.id) {
            onClose();
          } else {
            setErrorAccept(true);
          }
        })
        .catch(() => {
          setUploading(false);
          setErrorAccept(true);
        });
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Token ${state.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setSongs(data.results);
        }
      });
  }, []);

  return (
    <div>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <h2 className="title">Nueva Canción</h2>
          <form className="box">
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
              <label className="label">Albums:</label>
              <div className="control">
                <div className="select">
                  <select
                    name="album"
                    value={formData.album}
                    onChange={handleChange}
                  >
                    {songs.map((song) => (
                      <option key={song.id} value={song.id}>
                        {song.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Archivo de canción:</label>
              <div className="control">
                <input
                  className="song-file-input"
                  type="file"
                  accept=".mp3"
                  name="audio/*"
                  onChange={handleFileChange}
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
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Aceptar"}
                </button>
              </div>
              <div>
                <button
                  onClick={onClose}
                  className="button is-primary"
                  type="button"
                  disabled={uploading}
                >
                  Cancelar
                </button>
              </div>
            </div>
            {(!formData.title || !formData.year || !formData.song_file) && (
              <p>Inserte título, año y archivo MP3 de la canción.</p>
            )}
            {errorAccept && (
              <p>
                No puede insertar la canción! Las credenciales de autenticación
                no se proveyeron o hubo un error.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupSongs;