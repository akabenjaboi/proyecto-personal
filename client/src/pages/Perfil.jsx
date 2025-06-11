import React, { useState, useEffect } from "react";
import NavbarMenu from "../components/ui/navbar-menu";
import toast, { Toaster } from "react-hot-toast";
import { updateUser } from "../api/userApi";
import { getRoomsByOwner, toggleArchiveRoom } from "../api/roomApi";
import { useNavigate } from "react-router-dom";

function Perfil({ user, setUser }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [myRooms, setMyRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getRoomsByOwner(user.id).then((rooms) => {
        console.log("Habitaciones del usuario:", rooms);
        setMyRooms(rooms);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">No has iniciado sesión</h2>
          <p>Por favor, inicia sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await updateUser(form);
      toast.success("Perfil actualizado");
      setEdit(false);
      setUser(response.data);
    } catch {
      toast.error("Error al actualizar perfil");
    }
  };

  const handleEdit = (roomId) => {
    navigate(`/habitaciones/editar/${roomId}`);
  };

  const handleToggleArchive = async (roomId) => {
    const room = myRooms.find((r) => r.id === roomId);
    if (!room) return;
    try {
      const updatedRoom = await toggleArchiveRoom(roomId, !room.archived);
      setMyRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === roomId ? { ...r, archived: updatedRoom.archived } : r
        )
      );
      toast.success(
        updatedRoom.archived ? "Habitación archivada" : "Habitación desarchivada"
      );
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <NavbarMenu user={user} />
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl relative animate-fade-in mt-10">
        {/* Icono de perfil */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-400 shadow-lg">
              <svg
                className="w-16 h-16 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z"
                />
              </svg>
            </div>
            <span className="absolute bottom-2 right-2 bg-green-400 border-2 border-white rounded-full w-5 h-5 block"></span>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-blue-700 transition-all duration-300 text-center">
            {user.first_name} {user.last_name}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
              user.role === "student"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {user.role === "student" ? "Estudiante" : "Arrendador"}
          </span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Usuario */}
            <div>
              <span className="text-gray-500 text-xs">Usuario</span>
              <div className="text-lg font-semibold text-gray-800 break-all">
                {user.username}
              </div>
            </div>
            {/* Email */}
            <div>
              <span className="text-gray-500 text-xs">Email</span>
              {edit ? (
                <input
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <div className="text-lg text-gray-800 break-all">
                  {user.email}
                </div>
              )}
            </div>
            {/* Nombre */}
            <div>
              <span className="text-gray-500 text-xs">Nombre</span>
              {edit ? (
                <input
                  name="first_name"
                  value={form.first_name || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                  placeholder="Nombre"
                />
              ) : (
                <div className="text-lg text-gray-800">{user.first_name}</div>
              )}
            </div>
            {/* Apellido */}
            <div>
              <span className="text-gray-500 text-xs">Apellido</span>
              {edit ? (
                <input
                  name="last_name"
                  value={form.last_name || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                  placeholder="Apellido"
                />
              ) : (
                <div className="text-lg text-gray-800">{user.last_name}</div>
              )}
            </div>
            {/* Fecha de nacimiento */}
            <div>
              <span className="text-gray-500 text-xs">Nacimiento</span>
              {edit ? (
                <input
                  type="date"
                  name="birth_date"
                  value={form.birth_date || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <div className="text-lg text-gray-800">{user.birth_date}</div>
              )}
            </div>
            {/* Teléfono */}
            <div>
              <span className="text-gray-500 text-xs">Teléfono</span>
              {edit ? (
                <input
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <div className="text-lg text-gray-800">{user.phone}</div>
              )}
            </div>
            {/* Universidad */}
            <div>
              <span className="text-gray-500 text-xs">Universidad</span>
              {edit ? (
                <input
                  name="university"
                  value={form.university || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <div className="text-lg text-gray-800">{user.university}</div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            {edit ? (
              <>
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Guardar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEdit(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Editar
              </button>
            )}
          </div>
        </form>
        {/* NUEVO APARTADO DE PUBLICACIONES */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4 text-blue-700">
            Mis publicaciones
          </h3>
          {myRooms.length === 0 ? (
            <p className="text-gray-500">No tienes habitaciones publicadas.</p>
          ) : (
            <div className="space-y-4">
              {myRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center shadow"
                >
                  <div>
                    <div className="font-semibold">{room.title}</div>
                    <div className="text-gray-600 text-sm">
                      {room.city} - {room.address}
                    </div>
                    <div className="text-xs text-gray-400">
                      {room.archived ? "Archivada" : "Activa"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(room.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleArchive(room.id)}
                      className={`${
                        room.archived
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white px-3 py-1 rounded transition`}
                    >
                      {room.archived ? "Desarchivar" : "Archivar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Toaster />
      </div>
      {/* Animación de fondo */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default Perfil;