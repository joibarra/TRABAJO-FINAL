import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PopupSongs = ({ onClose}) =>{
  const state = useAuth("state");
  const [songs, setSongs] = useState([]);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    title: songs.title,
    year: songs.year,
    album: songs.id,
    
  });
  const handleChange = (e) => {
    const {name, value} = e.target;
    console.log(name,value)
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(formData);
  };
  const onAccept=()=>{
  fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/songs/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${state.token}`,
    },body: formData,
  })}

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/songs/`, {
      method: "GET",
      headers: {

        "Content-type": "application/json",
        Authorization: `Token ${state.token}`,
      },
      
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          console.log(data.results)
          setSongs(data.results);
        }
      });
  }, []);

  return (
    <div>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <h2 className="title">Nueva Cancion</h2>
          <form className="box" >
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
              <label className="label">Albums:</label>
              <div className="control">
                <div className="select">
                  <select
                    name="album"
                    
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
            <div className="field"style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={onAccept}className="button is-primary" type="submit">
                Aceptar
              </button>
            
              <button  onClick={onClose} className="button is-primary" type="submit">
                Cancelar
              </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupSongs;
