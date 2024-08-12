import { createBrowserRouter } from "react-router-dom";
import AlbumsForm from "../components/Album/AlbumsForm";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../components/Profile";
import SongList from "../components/MusicPlayer/SongList";
import Album from "../components/Album/Albums";
import BuscadorDeCanciones from "../components/BuscadorDeCanciones"; // Asegúrate de que la ruta de importación sea correcta
import Login from "../components/Auth/Login";
import Albums from "../components/Album/Albums";
import ArtistList from "../components/Artist/ArtistList"; // Importa el componente ArtistList

const routes = [
  {
    element: <Layout />,
    children: [
      {
        index: true, // path: "/"
        element: <Login />,
      },
      {
        path: "album",
        element: (
          <ProtectedRoute>
            <Albums />
          </ProtectedRoute>
        ), // Página de inicio en la ruta "/home"
      },
      {
        path: "albums",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Album />
              </ProtectedRoute>
            ),
          },
          {
            path: "add",
            element: (
              <ProtectedRoute>
                <AlbumsForm />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "songs",
        element: <SongList />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "ArtistList",
        element: <ArtistList />, // Define la ruta para ArtistList
      },
      {
        path: "BuscadorDeCanciones", // Agrega la ruta para BuscadorDeCanciones
        element: (
          <ProtectedRoute>
            <BuscadorDeCanciones />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <h1>Not Found</h1>,
  },
];

const Router = createBrowserRouter(routes);

export { Router, routes };