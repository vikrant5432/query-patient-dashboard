import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DBProvider } from "./providers/DBProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DBProvider>
      <App />
    </DBProvider>
  </StrictMode>
);
