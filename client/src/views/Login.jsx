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
    <div className='auth-container' style={{ padding: 0, background: 'white' }}>
      <div className='auth-grid'>
        {/* Left Column: Branding with Image Background */}
        <div
          style={{
            background: `linear-gradient(rgba(0,0,0, 0.65), rgba(0,0,0, 0.5)), url('/log-bg.jpg') center/cover no-repeat`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: '4rem',
            minHeight: '300px',
          }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <img
              src='/logo.png'
              alt='EduSphere Logo'
              style={{
                width: '80px',
                height: '80px',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
              }}
            />
            <h1
              style={{
                fontSize: '2.5rem',
                margin: '0 0 1rem 0',
                color: 'white',
                fontWeight: '800',
              }}>
              EduSphere
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                opacity: 0.7,
                maxWidth: '400px',
                lineHeight: 1.6,
                textAlign: 'center',
                fontWeight: '500',
                color: 'white',
              }}>
              Empowering education through intelligent collaboration and
              seamless learning experiences.
            </p>
          </motion.div>
        </div>

        {/* Right Column: Form */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f8fafc',
          }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2
                style={{
                  fontSize: '2rem',
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                }}>
                Welcome Back
              </h2>
              <p style={{ color: '#64748b' }}>
                Please sign in to your account.
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
                  style={{ background: 'white' }}
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
                  style={{ background: 'white' }}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='btn btn-primary w-full justify-center'
                style={{ marginTop: '1rem', height: '48px', fontSize: '1rem' }}>
                {isLoading ? (
                  <Loader2 className='animate-spin' size={20} />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
