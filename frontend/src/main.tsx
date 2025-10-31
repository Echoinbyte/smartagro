import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoPage from "./components/shared/NoPage";
import Login from "./page/auth/Login";
import Home from "./page/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <div>
              <Home />
            </div>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
