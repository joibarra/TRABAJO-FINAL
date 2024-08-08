import {useRef, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";

function Login() {
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth("actions");

  function handleSubmit(event) {
    event.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}api-auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo iniciar sesión");
          }
          return response.json();
        })
        .then((responseData) => {
          login(responseData.token);
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error error al iniciar sesión", error);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  return (
    <section className="section">
      <div
        className="columns is-centered"
        style={{
          backgroundColor: "#eaeaea",
          borderRadius: 1,
        }}
      >
        <div
          className="column is-4"
          style={{
            backgroundColor: "#eaeaea",
            borderRadius: 1,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="field" style={{background: "#eaeaea"}}>
              <label htmlFor="username">Nombre de usuario:</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  id="username"
                  name="username"
                  ref={usernameRef}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña:</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  name="password"
                  ref={passwordRef}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button
                  type="submit"
                  className="button is-primary is-fullwidth"
                >
                  Enviar
                </button>
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los datos.</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
