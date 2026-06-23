import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CompletionProvider } from "./context/CompletionContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CompletionProvider>
        <App />
      </CompletionProvider>
    </BrowserRouter>
  </StrictMode>,
);
