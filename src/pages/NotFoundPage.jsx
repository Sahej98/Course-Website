import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: 8 }}>404</h1>
    <p style={{ fontSize: '1.25rem', marginBottom: 16 }}>
      Oops! The page you’re looking for doesn’t exist.
    </p>
    <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
      <Link to='/' className='button button-primary'>
        Go Home
      </Link>
      <Link to='/courses' className='button button-outline'>
        Browse Courses
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
