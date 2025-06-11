import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/Inicio";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import Habitaciones from "./pages/Habitaciones";
import HabitacionDetalle from "./pages/HabitacionDetalle";
import PublicarHabitacion from "./pages/PublicarHabitacion";

function App() {
  // Persistencia del usuario en localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/inicio" element={<Inicio user={user} setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil user={user} setUser={setUser} />} />
        <Route path="/habitaciones" element={<Habitaciones user={user} />} />
        <Route path="/habitaciones/:id" element={<HabitacionDetalle user={user} />} />
        <Route path="/habitaciones/publicar" element={<PublicarHabitacion user={user} />} />
        <Route path="*" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;