import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Loader2 } from 'lucide-react';

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <img
            src='https://cdn-icons-png.flaticon.com/512/1089/1089129.png'
            alt='Logo'
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 1rem',
              display: 'block',
            }}
          />
          <h2 className='auth-title'>Create Account</h2>
          <p className='auth-subtitle'>Join EduSphere today</p>
        </div>

        {error && <div className='error-banner'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Full Name</label>
            <input
              type='text'
              required
              className='input-field'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
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
          <div className='form-group'>
            <label className='form-label'>I am a</label>
            <select
              className='input-field'
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }>
              <option value='STUDENT'>Student</option>
              <option value='TEACHER'>Instructor</option>
            </select>
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
                <UserPlus size={20} /> Sign Up
              </>
            )}
          </button>
        </form>

        <p className='auth-footer'>
          Already have an account?{' '}
          <Link to='/login' className='auth-link'>
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
