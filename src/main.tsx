import App from "App";
import { EditorProvider } from "CMGSequenceEditorContext";
import "index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <EditorProvider>
        <App />
      </EditorProvider>
    </HelmetProvider>
  </StrictMode>
);
