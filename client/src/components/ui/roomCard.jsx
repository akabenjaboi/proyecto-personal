import React from "react";
import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <Link to={`/habitaciones/${room.id}`}>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">{room.title}</h3>
        <p className="text-gray-600 mb-2">{room.description}</p>
        <span className="text-blue-600 font-bold">${room.price}</span>
      </div>
    </Link>
  );
}

export default RoomCard;