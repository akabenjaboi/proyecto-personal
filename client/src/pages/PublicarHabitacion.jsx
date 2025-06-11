import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api/roomApi";
import NavbarMenu from "../components/ui/navbar-menu";
import toast, { Toaster } from "react-hot-toast";

function PublicarHabitacion({ user }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    available_from: "",
    available_to: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let newErrors = {};
    if (!form.title || form.title.length < 5) newErrors.title = "El título debe tener al menos 5 caracteres";
    if (!form.description || form.description.length < 20) newErrors.description = "La descripción debe tener al menos 20 caracteres";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = "El precio debe ser un número positivo";
    if (!form.city) newErrors.city = "La ciudad es obligatoria";
    if (!form.address) newErrors.address = "La dirección es obligatoria";
    if (!form.available_from) newErrors.available_from = "La fecha de inicio es obligatoria";
    if (!form.available_to) newErrors.available_to = "La fecha de fin es obligatoria";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Si no hay errores, envía el formulario
    try {
      await createRoom({
        ...form,
        price: Number(form.price).toFixed(2), // <-- Esto asegura el formato decimal
      });
      toast.success("Habitación publicada");
      setTimeout(() => navigate("/habitaciones"), 1200);
    } catch (error) { 
      console.error(error.response?.data);
      toast.error(error?.response?.data?.detail || "Error al publicar habitación");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarMenu user={user} />
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Publicar habitación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Título</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Precio</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
          </div>
          {/* Ciudad */}
          <div>
            <label className="block text-gray-700 mb-1">Ciudad</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.city && <p className="text-red-500 text-xs italic">{errors.city}</p>}
          </div>
          {/* Dirección */}
          <div>
            <label className="block text-gray-700 mb-1">Dirección</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
          </div>
          {/* Disponible desde */}
          <div>
            <label className="block text-gray-700 mb-1">Disponible desde</label>
            <input
              type="date"
              name="available_from"
              value={form.available_from}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.available_from && <p className="text-red-500 text-xs italic">{errors.available_from}</p>}
          </div>
          {/* Disponible hasta */}
          <div>
            <label className="block text-gray-700 mb-1">Disponible hasta</label>
            <input
              type="date"
              name="available_to"
              value={form.available_to}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.available_to && <p className="text-red-500 text-xs italic">{errors.available_to}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Publicar
          </button>
        </form>
        <Toaster />
      </div>
    </div>
  );
}

export default PublicarHabitacion;