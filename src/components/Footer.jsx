import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='footer'>
      <div className='container footer-inner'>
        <div className='footer-column'>
          <h4>LearnHub</h4>
          <p style={{ fontSize: '0.9rem' }}>
            Building careers with structured tech education.
          </p>
        </div>
        <div className='footer-column'>
          <h4>Courses</h4>
          <a href='#paths'>Paths</a>
          <a href='#courses'>Free</a>
          <a href='#pricing'>Pro</a>
          <a href='#blog'>Blog</a>
        </div>
        <div className='footer-column'>
          <h4>Company</h4>
          <a href='#about'>About</a>
          <a href='#instructors'>Instructors</a>
          <a href='#careers'>Careers</a>
          <a href='#support'>Support</a>
        </div>
        <div className='footer-column'>
          <h4>Legal</h4>
          <a href='#terms'>Terms</a>
          <a href='#privacy'>Privacy</a>
          <a href='#cookies'>Cookies</a>
        </div>
      </div>
      <div
        className='container'
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
        <div style={{ fontSize: '0.75rem' }}>
          © {year} LearnHub. All rights reserved.
        </div>
        <div style={{ fontSize: '0.75rem' }}>Privacy · Cookies · Security</div>
      </div>
    </footer>
  );
};

export default Footer;
