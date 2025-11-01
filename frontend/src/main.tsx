import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoPage from "./components/shared/NoPage";
import Login from "./page/auth/Login";
import Landing from "./page/Landing";
import Home from "./page/Home";
import ProviderWrapper from "./provider/ProviderWrapper";
import Add from "./page/Add";
import Profile from "./page/Profile";
import ColdStorage from "./page/ColdStorage";
import IndividualProductListing from "./page/IndividualProductListing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderWrapper>
      <BrowserRouter>
        <Routes>
          <Route
            index
            path="/"
            element={
              <div>
                <Landing />
              </div>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Home />} />
          {/* <Route path="orders" element={<Orders />} /> */}
          <Route path="add" element={<Add />} />
          <Route path="coldstorage" element={<ColdStorage />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="product/:productId"
            element={<IndividualProductListing />}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </ProviderWrapper>
  </StrictMode>
);
