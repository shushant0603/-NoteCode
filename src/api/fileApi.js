import axios from 'axios';

// const BASE_URL = 'http://localhost:3000/api/files'; // your backend URL
const BASE_URL="https://note-code-backend.onrender.com/api/files"

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("NoteCode");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createFile = async (fileData) => {
  console.log("API: Creating file with data:", fileData);
  console.log("API: Auth headers:", getAuthHeaders());
  console.log("API: Data types:", {
    name: typeof fileData.name,
    language: typeof fileData.language,
    code: typeof fileData.code,
    algo: typeof fileData.algo
  });
  
  try {
    const response = await axios.post(BASE_URL, fileData, { headers: getAuthHeaders() });
    console.log("API: Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API: Error creating file:", error);
    console.error("API: Error response:", error.response?.data);
    console.error("API: Error status:", error.response?.status);
    console.error("API: Full error:", error);
    throw error;
  }
};

export const updateFile = async (fileId, updates) => {
  const response = await axios.patch(`${BASE_URL}/${fileId}`, updates, { headers: getAuthHeaders() });
  return response.data;
};

export const getFilesByUser = async (userId) => {
  const response = await axios.get(`${BASE_URL}/user/${userId}`, { headers: getAuthHeaders() });
  return response.data;
};

export const getFileById = async (fileId) => {
  const response = await axios.get(`${BASE_URL}/${fileId}`, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteFile = async (fileId) => {
  console.log("API: Deleting file with ID:", fileId);
  try {
    const response = await axios.delete(`${BASE_URL}/${fileId}`, { headers: getAuthHeaders() });
    console.log("API: Delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API: Error deleting file:", error);
    console.error("API: Error response:", error.response?.data);
    console.error("API: Error status:", error.response?.status);
    throw error;
  }
};
