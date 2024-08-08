import {createBrowserRouter} from "react-router-dom";
import ArticleForm from "../components/Article/ArticleForm";
import Home from "../components/Home";
import Login from "../components/Auth/Login";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../components/Profile";
import SongList from "../components/MusicPlayer/SongList";
import Article from "../components/Article/Article";
const routes = [
  {
    element: <Layout />,
    children: [
      {
        index: true, // path: "/"
        element: <Login />,
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ), // Página de inicio en la ruta "/home"
      },
      {
        path: "articles",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Article />
              </ProtectedRoute>
            ),
          },
          {
            path: "add",
            element: (
              <ProtectedRoute>
                <ArticleForm />
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
    ],
  },
  {
    path: "*",
    element: <h1>Not Found</h1>,
  },
];
const Router = createBrowserRouter(routes);

export {Router, routes};
