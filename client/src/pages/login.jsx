import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { getUserList, loginUser } from "../api/userApi";

function Login({ setUser }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const token = await loginUser(data.username, data.password);
      toast.success("¡Login exitoso!");
      const users = await getUserList(token);
      const usuario = users.find(u => u.username === data.username);
      setUser(usuario); 
      navigate("/inicio");
    } catch (error) {
      // Mostrar mensaje del backend si existe
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Credenciales incorrectas");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Usuario</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("username", { required: true })}
              autoComplete="username"
            />
            {errors.username && <span className="text-red-500 text-sm">Este campo es requerido</span>}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("password", { required: true })}
              autoComplete="current-password"
            />
            {errors.password && <span className="text-red-500 text-sm">Este campo es requerido</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
        <Toaster />
      </div>
    </div>
  );
}

export default Login;