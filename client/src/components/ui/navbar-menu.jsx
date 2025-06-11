import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavbarMenu({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-10">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/inicio" className="text-xl font-bold text-blue-600">
          UniRooms
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/inicio" className="hover:text-blue-600 transition">Inicio</Link>
          <Link to="/habitaciones" className="hover:text-blue-600 transition">Habitaciones</Link>
          {user ? (
            <>
              <Link to="/perfil" className="hover:text-blue-600 transition">Perfil</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Iniciar sesión</Link>
              <Link to="/register" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Crear cuenta</Link>
            </>
          )}
        </div>
        {/* Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-4 py-4">
          <Link to="/inicio" className="py-2 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/habitaciones" className="py-2 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Habitaciones</Link>
          {user ? (
            <>
              <Link to="/perfil" className="py-2 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Perfil</Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-center" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
              <Link to="/register" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-center" onClick={() => setMenuOpen(false)}>Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarMenu;