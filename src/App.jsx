import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CodePage from "./pages/CodePage";
import Login from "./component/Login";
import Signup from "./component/Signup";
import ProtectedRoute from "./component/ProtectedRule";
import Navbar from "./component/Navbar";

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("NoteCode");
    const savedUser = localStorage.getItem("NoteCodeUser");
    console.log("Loaded token from localStorage:", savedToken);
    console.log("Loaded user from localStorage:", savedUser);

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("NoteCode");
        localStorage.removeItem("NoteCodeUser");
        setToken(null);
        setUser(null);
      }
    } else if (savedToken && !savedUser) {
      // Token exists but no user data - clear token
      localStorage.removeItem("NoteCode");
      setToken(null);
      setUser(null);
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogin = (loginData) => {
    console.log("Login, saving token and user:", loginData);
    setToken(loginData.token);
    setUser(loginData.user);
    localStorage.setItem("NoteCode", loginData.token);
    localStorage.setItem("NoteCodeUser", JSON.stringify(loginData.user));
  };

  const handleLogout = () => {
    console.log("Logging out, clearing token and user");
    setToken(null);
    setUser(null);
    localStorage.removeItem("NoteCode");
    localStorage.removeItem("NoteCodeUser");
  };

  if (loading) {
    // Show loading while token is being checked
    return <div>Loading...</div>;
  }

  const isAuthenticated = !!token;
  console.log("isAuthenticated:", isAuthenticated);

  return (
    <Router>
      <div>
        {/* Show Navbar only if logged in */}
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        
        <Routes>
          <Route
            path="/"
            element={
              <AuthPage
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/code"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CodePage user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
