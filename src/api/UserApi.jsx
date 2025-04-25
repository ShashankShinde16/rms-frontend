import axios from "axios";

const API_URL = `http://localhost:3000/api/v1/users/`;
export const getUserDetails = async (token) => {
  const res = await axios.get(`${API_URL}me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
