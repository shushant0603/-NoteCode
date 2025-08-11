import React from "react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png" // Replace with the path to your logo
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-lg font-bold">MyApp</span>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;