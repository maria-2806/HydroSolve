// src/components/UserNavbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import { UserContext } from '../context/UserContext'; // Import UserContext

const UserNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="p-4 flex justify-between items-center border-b-2">
      <h1 className='font-bold'>Hydrosolve</h1>
    <ul className='list-none flex gap-40 pr-6 font-bold text-[#3a3a3a]'>
      <li onClick={() => navigate("/user/home")} className='hover:cursor-pointer hover:text-black'>Home</li>
      <li onClick={() => navigate("/user/report")} className='hover:cursor-pointer hover:text-black'>Report</li>
      <li onClick={() => navigate("/map")} className='hover:cursor-pointer hover:text-black'>Map</li>
    </ul>
      <h1 onClick={() => navigate("/")} className='font-bold hover:cursor-pointer hover:text-black'>Logout</h1>
    </nav>
  );
};

export default UserNavbar;
