import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";

const PopupAlbum = ({album, onClose}) => {
  const state = useAuth("state");
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    title: album.title,
    year: album.year,
    artist: album.artist,
    artistName: album.artistName,
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(formData);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/artists/`, {
      method: "GET",
      headers: {
        accept: "application/json",
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
          <h2 className="title">Album</h2>
          <form className="box" onSubmit={handleSubmit}>
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
                  name="artists"
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Artista:</label>
              <div className="control">
                <div className="select">
                  <select
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                  >
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <button className="button is-primary" type="submit">
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupAlbum;

