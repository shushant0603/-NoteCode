import axios from 'axios';

// const BASE_URL = 'http://localhost:3000/api/auth'; // your backend URL
const BASE_URL = "https://note-code-backend.onrender.com/api/auth";

export const signup=async(name,email,password)=>{
    try{
        const response =await axios.post(`${BASE_URL}/register`,{name,email,password});
        return response.data;
    }catch(error){
        throw new Error(
            error.response?.data?.message || 'Signup failed! Please try again.'
        )
    }
}


export const login = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password }, { withCredentials: true });
    return response.data;
  };