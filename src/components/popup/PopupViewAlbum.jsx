import React, {useEffect, useState, useRef} from "react";
import SongCard from "../MusicPlayer/SongCard";

const PopupViewAlbum = ({album, onClose}) => {
  const [songs, setSongs] = useState([]);
  const lastSongElementRef = useRef();
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}harmonyhub/songs/?album=${album.id}`,
      {}
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          console.log("data", data.results);
          setSongs(data.results);
        }
      });
  }, []);
  return (
    <div>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <h2 className="title">Album</h2>
          <form className="box">
            <div
              style={{
                display: "flex",
                color: "#61F2B1",
                justifyContent: "space-around",
              }}
            >
              <div className="control" style={{marginRight: "20px"}}>
                <label className="label">Título:</label>

                <input
                  className="input"
                  type="text"
                  name="title"
                  defaultValue={album.title}
                />
              </div>
              <div className="control" style={{marginRight: "20px"}}>
                <label className="label">Año:</label>

                <input
                  className="input"
                  type="number"
                  name="year"
                  defaultValue={album.year}
                />
              </div>
              <div className="control" style={{marginRight: "20px"}}>
                <label className="label">Artista:</label>

                <input
                  className="input"
                  type="text"
                  name="artist"
                  defaultValue={album.artistName}
                />
              </div>
            </div>
            <ul>
              {songs.map((song, index) => {
                if (songs.length > 0) {
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
            <div
              className="field"
              style={{display: "flex", justifyContent: "end", margin: "10px"}}
            >
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

export default PopupViewAlbum;