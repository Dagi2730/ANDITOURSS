import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await dispatch(isLogin ? login(formData) : register(formData)).unwrap();
      alert(isLogin ? 'Welcome back to Andi Tours!' : 'Account created successfully!');
      navigate(result?.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Connection refused. Please check the backend.');
    }
  };

  useEffect(() => {
    if (user) {
      navigate(user.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="glass-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <p>{isLogin ? 'Explore the beauty of Ethiopia' : 'Join our travel community'}</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
              <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            </>
          )}
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          
          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="toggle-text">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</span>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                      url('https://images.unsplash.com/photo-1523805081446-ed9a7bb84eaa?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .glass-card {
          width: 380px;
          padding: 45px 35px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          color: #ffffff;
          text-align: center;
        }

        .auth-header h2 {
          font-size: 2.2rem;
          margin-bottom: 8px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .auth-header p {
          font-size: 0.95rem;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.9);
        }

        .auth-form input {
          width: 100%;
          padding: 14px;
          margin-bottom: 18px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .auth-form input::placeholder {
          color: rgba(255, 255, 255, 0.9) !important;
          opacity: 1;
        }

        .auth-form input:focus {
          background: rgba(0, 0, 0, 0.4);
          border-color: #C0CA33;
          box-shadow: 0 0 8px rgba(192, 202, 51, 0.4);
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #556B2F; 
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: 0.3s;
        }

        .submit-btn:hover {
          background: #6B8E23;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .toggle-text {
          margin-top: 25px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .toggle-text span {
          cursor: pointer;
          font-weight: 700;
          color: #C0CA33;
          margin-left: 5px;
          transition: 0.2s;
        }

        .toggle-text span:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .error-box {
          background: rgba(211, 47, 47, 0.4);
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.85rem;
          border: 1px solid rgba(211, 47, 47, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Login;