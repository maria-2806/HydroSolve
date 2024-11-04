// src/components/UserNavbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// import { UserContext } from '../context/UserContext'; // Import UserContext

const UserNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="pt-3 px-4 flex justify-between items-center border-b-2">
      <p className="font-bold text-xl">HydroSolve</p>
      <ul className="list-none flex gap-7 pr-5 font-bold text-[#3a3a3a] ml-auto">
        <li
          onClick={() => navigate("/user/home")}
          className="hover:cursor-pointer hover:text-black"
        >
          Home
        </li>
        <li
          onClick={() => navigate("/user/report")}
          className="hover:cursor-pointer hover:text-black"
        >
          Report
        </li>
        <li
          onClick={() => navigate("/map")}
          className="hover:cursor-pointer hover:text-black"
        >
          Map
        </li>
        <li
          onClick={() => navigate("/")}
          className="hover:cursor-pointer hover:text-black"
        >
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;
