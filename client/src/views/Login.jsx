import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='auth-card'>
        <div className='auth-header'>
          <div className='auth-logo'>E</div>
          <h2 className='auth-title'>Welcome Back</h2>
          <p className='auth-subtitle'>
            Sign in to continue your learning journey
          </p>
        </div>

        {error && <div className='error-banner'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Email Address</label>
            <input
              type='email'
              required
              className='input-field'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              type='password'
              required
              className='input-field'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='btn btn-primary w-full justify-center'
            style={{ marginTop: '0.5rem' }}>
            {isLoading ? (
              <Loader2 className='animate-spin' size={20} />
            ) : (
              <>
                <LogIn size={20} /> Sign In
              </>
            )}
          </button>
        </form>

        <p className='auth-footer'>
          Don't have an account?{' '}
          <Link to='/register' className='auth-link'>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
