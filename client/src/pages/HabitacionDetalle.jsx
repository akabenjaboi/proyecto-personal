import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../api/roomApi";
import NavbarMenu from "../components/ui/navbar-menu";

function HabitacionDetalle({ user }) {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    getRoom(id).then(setRoom);
  }, [id]);

  if (!room) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarMenu user={user} />
      <div className="max-w-xl mx-auto py-10 bg-white rounded-lg shadow p-8 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{room.title}</h2>
        <p className="mb-2 text-gray-700">{room.description}</p>
        <div className="mb-2 text-lg font-semibold text-blue-600">${room.price}</div>
        {/* Puedes agregar más detalles aquí */}
      </div>
    </div>
  );
}

export default HabitacionDetalle;