import api from "./axiosInstance";

const BASE_URL = "http://localhost:8000/listings/api/rooms/";

export async function getRooms() {
  const res = await api.get(BASE_URL);
  return res.data;
}

export async function getRoom(id) {
  const res = await api.get(`${BASE_URL}${id}/`);
  return res.data;
}

export async function createRoom(data) {
  return api.post(BASE_URL, data);
}

export async function updateRoom(id, data) {
  const res = await api.put(`${BASE_URL}${id}/`, data);
  return res.data;
}

export async function deleteRoom(id) {
  await api.delete(`${BASE_URL}${id}/`);
}

export async function getRoomsByOwner(ownerId) {
  const res = await api.get(BASE_URL);
  console.log("Respuesta cruda de rooms:", res.data);
  return res.data.filter(room => String(room.owner?.id ?? room.owner) === String(ownerId));
}

export async function toggleArchiveRoom(id, archived) {
  const res = await api.put(`${BASE_URL}${id}/`, { archived });
  return res.data;
}