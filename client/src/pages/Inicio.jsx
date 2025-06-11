import React from "react";
import { Link } from "react-router-dom";
import NavbarMenu from "../components/ui/navbar-menu";




function Inicio({ user, setUser }) {
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            No has iniciado sesión
          </h2>
          <p className="mb-6 text-gray-600">
            Por favor, inicia sesión o crea una cuenta para continuar.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Iniciar sesión
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Crear cuenta
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <NavbarMenu user={user} onLogout={() => setUser(null)} />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Bienvenido, {user.first_name || user.username}!
        </h2>
        <p className="text-gray-600">Has iniciado sesión correctamente.</p>
      </div>
    </div>
  );
}

export default Inicio;