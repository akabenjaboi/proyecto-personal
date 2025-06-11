import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRooms } from "../api/roomApi";
import NavbarMenu from "../components/ui/navbar-menu";
import RoomCard from "../components/ui/roomCard";

function Habitaciones({ user }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 mt-15">
      <NavbarMenu user={user} />
      <div className="max-w-3xl mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Habitaciones disponibles</h2>
          <Link
            to="/habitaciones/publicar"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Publicar
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {rooms
            .filter(room => room.archived === false)
            .map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Habitaciones;