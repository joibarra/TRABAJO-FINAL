import React, {useState, useEffect} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import PopupMsj from "../popup/PopupMsj";

export default function ArticleForm() {
  const [articleData, setArticleData] = useState({title: "", content: ""});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [articleImage, setArticleImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const state = useAuth("state");
  const navigate = useNavigate();

  useEffect(
    () => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}infosphere/categories/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se puedieron cargar las categorías");
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
    setArticleData({
      ...articleData,
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
    setArticleImage(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!submitting && !loadingCategories) {
      setSubmitting(true);
      const newForm = new FormData();
      newForm.append("title", articleData.title);
      newForm.append("content", articleData.content);
      if (articleImage) {
        newForm.append("image", articleImage);
      }
      fetch(`${import.meta.env.VITE_API_BASE_URL}infosphere/articles/`, {
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
              }infosphere/article-categories/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${state.token}`,
                },
                body: JSON.stringify({
                  article: data.id,
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
    navigate("/articles");
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
              value={articleData.title}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Contenido</label>
          <div className="control">
            <textarea
              className="textarea"
              name="content"
              value={articleData.content}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Imagen:</label>
          <div className="control">
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
        <PopupMsj
          message="Se creó correctamente el artículo"
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}