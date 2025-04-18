import axios from "axios";

const API_URL = `http://13.200.204.1/api/v1/users/`;
export const getUserDetails = async (token) => {
  const res = await axios.get(`${API_URL}me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
