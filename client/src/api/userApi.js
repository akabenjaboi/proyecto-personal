import api from "./axiosInstance";
import axios from "axios";

// Login: aquí sí usas axios directo porque aún no tienes token
export async function loginUser(username, password) {
  const response = await axios.post("http://localhost:8000/api/token/", {
    username,
    password,
  });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response.data.access;
}

// Listar usuarios (usa api para que refresque token si es necesario)
export async function getUserList() {
  const response = await api.get("http://localhost:8000/accounts/api/users/");
  return response.data;
}

// Registrar usuario (no requiere token)
export async function registerUser(data) {
  return axios.post("http://localhost:8000/accounts/api/users/", data);
}

// Actualizar usuario (usa api para refrescar token si es necesario)
export async function updateUser(data) {
  return api.put(
    `http://localhost:8000/accounts/api/users/${data.id}/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}