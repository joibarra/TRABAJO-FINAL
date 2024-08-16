import React, {useState, useEffect} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import PopupMsj from "../popup/PopupMsj";
import PopupCreateAlbum from "../popup/PopupCreateAlbum";

export default function AlbumForm() {
  const [albumData, setAlbumData] = useState({title: "", content: ""});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [albumImage, setAlbumImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const state = useAuth("state");
  const navigate = useNavigate();

  useEffect(
    () => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/album/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se cargaron los albumes");
          }
          return response.json();
        })
        .then((data) => {
          setCategories(data.results);
        })
        .catch((error) => {
          console.error("Error al realizar la petición", error);
        })
        .finally(() => {
          return setLoadingCategories(false);
        });
    },
    [] /*Cuando se monta el componente*/
  );

  function handleInputChange(event) {
    setAlbumData({
      ...albumData,
      [event.target.name]: event.target.value,
    });
  }

  function handleCategoryChange(event) {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      // Referenciamos el id de la categoría que resolvió la petición a la API
      (option) => option.value
    );

    // Filtramos de las categorías consultadas a la API los nuevos elementos seleccionados
    const updatedSelectedCategories = categories.filter((cat) =>
      selectedOptions.includes(String(cat.id))
    );

    setSelectedCategories(updatedSelectedCategories);
  }

  function handleImageChange(event) {
    setAlbumImage(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!submitting && !loadingCategories) {
      setSubmitting(true);
      const newForm = new FormData();
      newForm.append("title", albumData.title);
      newForm.append("content", albumData.content);
      if (albumImage) {
        newForm.append("image", albumImage);
      }
      fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/albums/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${state.token}`,
        },
        body: newForm,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo crear el artículo");
          } else {
            if (response.ok) {
              setShowPopup(true);
            }
          }
          return response.json();
        })
        .then((data) => {
          selectedCategories.forEach((category) => {
            fetch(
              `${
                import.meta.env.VITE_API_BASE_URL
              }harmonyhub/album-categories/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${state.token}`,
                },
                body: JSON.stringify({
                  album: data.id,
                  category: category.id,
                }),
              }
            );
          });
        })
        .then()
        .catch((error) => {
          console.error("Error error al crear el artículo", error);
        })
        .finally(() => {
          return setSubmitting(false);
        });
    }
  }
  function handleClosePopup() {
    setShowPopup(false);
    navigate("/albums");
  }
  return (
    <>
      <form
        className={`box m-4 p-4 has-background-dark`}
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label">Título</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="title"
              value={albumData.title}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Año</label>
          <div className="control">
            <textarea
              className="textarea"
              name="content"
              value={albumData.content}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">fecha de creación a partir de : </label>
          <div className="control">
          <textarea
              className="textarea"
              name="content"
              value={albumData.content}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Categorías:</label>
          <div className="select is-fullwidth is-multiple">
            <select
              multiple
              size="5"
              value={selectedCategories.map((cat) => cat.id)}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              className="button is-primary"
              type="submit"
              disabled={submitting || loadingCategories}
            >
              Crear Artículo
            </button>
          </div>
        </div>
      </form>
      {showPopup && (
        <PopupCreateAlbum
          
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}