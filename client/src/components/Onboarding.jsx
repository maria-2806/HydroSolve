import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    navigate(`/${selectedRole}/login`);
  };

  return (
    <div className="bgwrap">

    <div className="onboarding wrapper">
      <div className='form-box'>
        <h1 className="head text-white font-bold text-center text-4xl">WELCOME </h1>
        <h1 className="text-white text-center font-bold text-xl">to </h1>
        <h1 className="text-white text-center font-bold text-2xl">HydroSolve </h1>

        <div className='text-white mt-12'>
          Do you want to login as user or administrator?
        </div>

        <div className="role-selection">
          <button 
            className='mt-6 mb-4 mx-2 w-[95%] h-[45px] bg-[#100b03] border-none outline-none rounded-lg cursor-pointer text-base text-white font-medium' 
            onClick={() => handleRoleSelection('user')}>
            User
          </button>
          <button 
            className='mx-2 w-[95%] h-[45px] bg-[#100b03] border-none outline-none rounded-lg cursor-pointer text-base text-white font-medium' 
            onClick={() => handleRoleSelection('admin')}>
            Administrator
          </button>
        </div>
      </div>
    </div>
              </div>
  );
};

export default Onboarding;
