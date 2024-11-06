import React, { useState } from 'react';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from './supabaseClient';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        alert(error.message);
      } else {
        navigate('/dashboard', { state: { user: data.user } });
      }
      
    } else {
      const { error, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });
      if (error) {
        alert(error.message);
      } else {
        navigate('/dashboard', { state: { user: data } });
      }
    }
  };

  return (
    <div className='d-flex align-items-center justify-content-center bg-white' style={{ height: '100vh' }}>
      <div className='px-5 pt-4 pb-5 text-dark shadow-lg border' style={{ borderRadius: '15px' }}>
        <span className='text-center d-flex align-item-center justify-content-center'>
          <img src={logo} width={60} alt="Logo" />
        </span>
        <h3 className='mb-1 mt-3'>to-do using supabase</h3>
        <hr />

        <form onSubmit={handleSubmit}>
          {/* Show Name and Phone fields only for Signup */}
          {!isLogin && (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder='Enter name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone (optional)</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder='Enter phone'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder='Enter email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder='Enter password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-outline-secondary btn-sm w-100 mt-3">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="btn btn-outline-secondary btn-sm w-100 mt-3 switch-button"
        >
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default Authentication;
