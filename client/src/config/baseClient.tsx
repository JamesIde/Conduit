import axios from "axios";

const baseClient = axios.create({
  baseURL: `http://localhost:3000`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default baseClient;
