import React from "react";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="pt-3 px-4 flex justify-between items-center border-b-2">
      <p className="font-bold text-xl">HydroSolve</p>
      <ul className="list-none flex gap-7 pr-10 font-bold text-[#3a3a3a] ml-auto">
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
          onClick={() => navigate("/dashboard")}
          className="hover:cursor-pointer hover:text-black"
        >
          Dashboard
        </li>
        <li
          onClick={() => navigate("/map")}
          className="hover:cursor-pointer hover:text-black"
        >
          Map
        </li>
      </ul>
      <p
        onClick={() => navigate("/")}
        className="font-bold hover:cursor-pointer hover:text-black text-lg"
      >
        <button className="border border-gray-500 px-3 py-1 rounded hover:bg-gray-200">
          Logout
        </button>
      </p>
    </nav>
  );
};

export default UserNavbar;
