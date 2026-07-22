import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CompletionProvider } from "./context/CompletionContext";
import { RankProvider } from "./context/RankContext";
import { AchievementProvider } from "./context/AchievementContext";
import { AuthProvider } from "./context/AuthContext";
import { StudentProfileProvider } from "./context/StudentProfileContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CompletionProvider>
        <RankProvider>
          <AchievementProvider>
            <AuthProvider>
              <StudentProfileProvider>
                <FeedbackProvider>
                  <App />
                </FeedbackProvider>
              </StudentProfileProvider>
            </AuthProvider>
          </AchievementProvider>
        </RankProvider>
      </CompletionProvider>
    </BrowserRouter>
  </StrictMode>,
);
