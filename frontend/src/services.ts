import { ApiClient } from "@backend/client";
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const API = new ApiClient(client);
