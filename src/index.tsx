import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Hands } from "./components/Hands";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "hands",
    element: <Hands />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <RouterProvider router={router} />
  </>
);
