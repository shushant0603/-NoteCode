import React, { useState, useEffect } from "react";
import Login from "../component/Login";
import Signup from "../component/Signup";
import CodePage from "./CodePage";


const AuthPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("NoteCode"));

  useEffect(() => {
    const savedToken = localStorage.getItem("NoteCode");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("NoteCode", token);
  };

 

  console.log("Token:", token);

  return (
    <div>
   
     {/* // {token && <Navbar onLogout={handleLogout} />} */}
      {!token ? (
        isLoginPage ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setIsLoginPage(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLoginPage(true)} />
        )
      ) : (
        <CodePage />
      )}
    </div>
  );
};

export default AuthPage;
