import React, {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";


const PopupArtists = ({ onClose}) => {
  const state = useAuth("state");
  const [artists, setArtists] = useState([]);
  const [errorAccept, setErrorAccept] = useState(false);
  const [formData, setFormData] = useState({
    name: artists.name,
    bio: artists.bio,
    website: artists.website,
    image: artists.image
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData ({
        ...formData,
        image: file,

      })
    }
  }
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onAccept=()=>{
    if (formData.name) {
      const formDataArtist = new FormData();
      formDataArtist.append("name", formData.name);
      formDataArtist.append("bio", formData.bio);
      formDataArtist.append("website", formData.website);
      formDataArtist.append("image", formData.image);
      
    console.log(formData)
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/artists/`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Token ${state.token}`,
      },
      body: formDataArtist
    }).then((response) => {
      if (response.ok) {
        onClose();
      } else {
        setErrorAccept(true);
      }
    });
  }
};
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/artists/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
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
          <h2 style = {{color: "white"}}className="name"> Nuevo Artista</h2>
          <form className="box" >
            <div className="field">
              <label className="label">Nombre:</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Biografía:</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="bio"
                  
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Página web:</label>
              <div className="control">
                <input
                  className="input"
                  type="url"
                  name="website"
                    onChange={handleChange}
                  />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="image">
                Imagen:
              </label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
          />
            </div>
 
            <div className="field"style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={onAccept}className="button is-primary" type="button">
                Aceptar
              </button>
            
              <button  onClick={onClose} className="button is-primary" type="button">
                Cancelar
              </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupArtists;