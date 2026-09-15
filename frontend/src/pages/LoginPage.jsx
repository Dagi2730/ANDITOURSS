import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import lalibelaImg from '../assets/images/lalibela.jpg';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!formData.email || !formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }
    if (!isLogin && (!formData.name || !formData.name.trim())) {
      setError('Please enter your full name');
      return;
    }

    try {
      const result = await dispatch(
        isLogin ? login({ email: formData.email.trim(), password: formData.password }) : register(formData)
      ).unwrap();
      const role = (result?.role || result?.user?.role)?.toString().toUpperCase();
      navigate(role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Authentication failed. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      const role = user.role?.toString().toUpperCase();
      navigate(role === 'ADMIN' ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="glass-form" style={{maxWidth: '440px', width: '100%'}}>
        <div className="auth-header" style={{textAlign: 'center'}}>
          <h2>{isLogin ? 'Welcome Back' : 'Join Andi Tours'}</h2>
          <p style={{marginBottom: '25px', color: 'rgba(255, 255, 255, 0.9)'}}>
            {isLogin ? 'Sign in to manage your bookings' : 'Create an account to start your journey'}
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <>
              <div className="input-group">
                <label style={{color: '#fff', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600}}>Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Full Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label style={{color: '#fff', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600}}>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="+251 911 223344" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label style={{color: '#fff', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600}}>Email Address *</label>
            <input 
              type="email" 
              name="email" 
              placeholder="your.email@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label style={{color: '#fff', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600}}>Password *</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                placeholder="Enter password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
                aria-label={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="send-btn" disabled={isLoading} style={{marginTop: '15px'}}>
            {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="toggle-text">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>{isLogin ? 'Register' : 'Login'}</span>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 60px;
          background: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), 
                      url(${lalibelaImg}) no-repeat center center fixed;
          background-size: cover;
          font-family: 'Raleway', sans-serif;
        }

        .password-input-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .password-input-container input {
          padding-right: 48px !important;
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.2s ease, transform 0.2s ease;
          z-index: 10;
        }

        .password-toggle-btn:hover {
          color: #A8C55A;
          transform: translateY(-50%) scale(1.1);
        }

        .auth-page input {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          background: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          font-weight: 600 !important;
        }

        .auth-page input:-webkit-autofill,
        .auth-page input:-webkit-autofill:hover,
        .auth-page input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(20, 25, 15, 0.95) inset !important;
          color: #ffffff !important;
        }

        .auth-page input::placeholder {
          color: rgba(255, 255, 255, 0.75) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.75) !important;
          opacity: 1 !important;
        }

        .toggle-text {
          margin-top: 25px;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
        }

        .toggle-text span {
          cursor: pointer;
          font-weight: 700;
          color: #A8C55A;
          margin-left: 6px;
          transition: 0.2s;
        }

        .toggle-text span:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .toggle-text span:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .error-box {
          background: rgba(211, 47, 47, 0.5);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          border: 1px solid rgba(211, 47, 47, 0.7);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Login;