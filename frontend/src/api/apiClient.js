import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

const apiClient = axios.create({
  baseURL: "https://breathe-esg-assignment-g4i4.onrender.com/api",
});

export default apiClient;