import axios from "axios";


const BASE_URL = "https://api.nabomhalang.com/api";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});