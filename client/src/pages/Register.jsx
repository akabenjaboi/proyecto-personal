import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";

function Register() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("¡Usuario creado! Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      // Mostrar mensaje del backend si existe
      if (error.response && error.response.data) {
        // Si el backend devuelve un objeto con varios errores
        const messages = Object.values(error.response.data)
          .flat()
          .join(" ");
        toast.error(messages);
      } else {
        toast.error("Error al crear usuario");
      }
    }
  };

  // Validar y pasar al siguiente slide
  const handleNext = async () => {
    const valid = await trigger(["email", "first_name", "last_name", "birth_date", "phone"]);
    if (valid) setStep(2);
  };

  // Volver al slide anterior
  const handleBack = () => setStep(1);

  // Barra de estado
  const progress = step === 1 ? "w-1/2" : "w-full";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h2>
        {/* Barra de estado */}
        <div className="w-full h-2 bg-gray-200 rounded mb-6 overflow-hidden">
          <div
            className={`h-2 bg-blue-600 rounded transition-all duration-500 ${progress}`}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-h-[340px]">
          {/* Slide 1 */}
          <div className={`transition-all duration-500 ${step === 1 ? "block opacity-100" : "hidden opacity-0"}`}>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("first_name", { required: true })}
              />
              {errors.first_name && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Apellido</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("last_name", { required: true })}
              />
              {errors.last_name && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("birth_date", { required: true })}
              />
              {errors.birth_date && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("phone", { required: true })}
              />
              {errors.phone && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
            >
              Siguiente
            </button>
          </div>
          {/* Slide 2 */}
          <div className={`transition-all duration-500 ${step === 2 ? "block opacity-100" : "hidden opacity-0"}`}>
            <div>
              <label className="block text-gray-700 mb-1">Usuario</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("username", { required: true })}
              />
              {errors.username && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("password", { required: true })}
              />
              {errors.password && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Rol</label>
              <select
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("role", { required: true })}
              >
                <option value="">Selecciona un rol</option>
                <option value="student">Estudiante</option>
                <option value="landlord">Arrendador</option>
              </select>
              {errors.role && <span className="text-red-500 text-sm">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Universidad</label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("university")}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Registrarse
              </button>
            </div>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
}

export default Register;