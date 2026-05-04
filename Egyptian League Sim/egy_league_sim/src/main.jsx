import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { MatchesProvider } from "./contexts/MatchesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MatchesProvider>
      <App />
    </MatchesProvider>
  </StrictMode>,
);
