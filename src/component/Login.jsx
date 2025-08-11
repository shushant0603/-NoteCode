import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import {login} from "../api/auth"; // Assuming you have a login function in your API module
export default function Login({onLogin}) {
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // const response = await fetch("http://localhost:3000/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }), // Changed from username to email
      // });

      // if (!response.ok) {
      //   throw new Error("Login failed! Please check your credentials.");
      // }

      // const data = await response.json();
      // console.log("Login successful:", data);
      // if (onLogin) {
      //   onLogin(data); // Pass the full data object, not just data.token
      // }
      const data = await login(email, password);
      console.log("Login successful:", data);
      if (onLogin) onLogin(data);
      navigate('/code')// Pass the login data to the parent component
    } catch (err) {
      setError(err.message);
    }
  };
  const onSwitchToSignup =()=>{
    // Logic to switch to the signup page
    navigate('/signup'); // Redirect to the signup page
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-1/3 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-500 hover:underline"
          >
            Signup here
          </button>
        </p>
      </form>
    </div>
  );
}