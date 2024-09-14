import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSignUp = location.pathname.includes('signup');
  const role = location.pathname.includes('admin') ? 'admin' : 'user';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isSignUp ? '/signup' : '/login';

    try {
      const response = await axios.post(`https://hydrosolve.onrender.com${endpoint}`, {
        name: isSignUp ? name : undefined,
        email,
        password,
        role: isSignUp ? role : undefined,
      });

      if (response.data.token) {
        setSuccess('Successfully authenticated!');
        localStorage.setItem('token', response.data.token);
        // Optionally navigate to a different page after successful authentication
        // navigate('/some-protected-route');
        if (role === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/user/home');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="bgwrap">

    <div className="wrapper">
      <div className="auth-page">
        <h2 className='text-center text-2xl text-white font- w-full'>
          {isSignUp ? `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Login'}
        </h2>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <div className="form-box text-white">
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <input className='input-box'
              type="text"
              placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
              )}
            <input className='input-box'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
            <input className='input-box'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
            
            <div className='my-7 text-[#c2c0c2]'>
              {!isSignUp ? (
                <p className='mx-5 my-3'>
                  Don't have an account? 
                  <button 
                    type="button" 
                    onClick={() => navigate(`/${role}/signup`)} 
                    className='ml-2 text-blue-600 hover:underline'>
                    Register
                  </button>
                </p>
              ) : (
                <p className='mx-5 my-3'>
                  Already have an account? 
                  <button 
                    type="button" 
                    onClick={() => navigate(`/${role}/login`)} 
                    className='ml-2 text-blue-600 hover:underline'>
                    Login
                  </button>
                </p>
              )}
            
              <button type="submit" onClick={(params) => {
                
              }
            } className='mx-4 w-[90%] h-[45px] bg-[#100b03] border-none outline-none rounded-lg cursor-pointer text-base text-white font-medium'>
                {isSignUp ? 'Sign Up' : 'Login'}

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
                </div>
  );
};

export default Auth;
