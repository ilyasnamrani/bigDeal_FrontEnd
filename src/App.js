import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnnonceForm from "./pages/AnnonceForm";
import Annonces from "./pages/Annonces";
import MesAnnonces from "./pages/MesAnnonces";
import AnnonceFilter from "./pages/AnnoncesFilter";
import Messages from "./pages/Messages";
import MessagesFilter from "./pages/MessagesFilter";
import MessageForm from "./pages/MessageForm";
import ProfileInfo from "./pages/ProfileInfo";
import ProfileUpdate from "./pages/ProfileUpdate";
import AnnoncesRecherche from "./pages/AnnoncesRecherche";
import NotFound from "./pages/NotFound";



const App = ()=> (
     <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Regular authenticated user routes - use AppLayout */}
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/annonces/me" element={<MesAnnonces />} />
            <Route path="/annonces/annonce-recheche" element={<AnnoncesRecherche />} />
            <Route path="/annonce/create" element={<AnnonceForm />} />
             <Route path="/annonces/filter" element={<AnnonceFilter />} />
            <Route path="/messages/all" element={<Messages />} />
            <Route path="/message/create" element={<MessageForm />} />
            <Route path="/messages/filter" element={<MessagesFilter />} />
            <Route path="/profile" element={<ProfileInfo />} />
            <Route path="/profileUpdate" element={<ProfileUpdate />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

)

export default App;
