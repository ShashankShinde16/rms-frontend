import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/users/`;
export const getUserDetails = async (token) => {
  const res = await axios.get(`${API_URL}me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
