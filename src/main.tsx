import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CompletionProvider } from "./context/CompletionContext";
import { RankProvider } from "./context/RankContext";
import { AchievementProvider } from "./context/AchievementContext";
import { StudentProfileProvider } from "./context/StudentProfileContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CompletionProvider>
        <RankProvider>
          <AchievementProvider>
            <StudentProfileProvider>
              <App />
            </StudentProfileProvider>
          </AchievementProvider>
        </RankProvider>
      </CompletionProvider>
    </BrowserRouter>
  </StrictMode>,
);
