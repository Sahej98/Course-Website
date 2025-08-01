import React, { useState } from 'react';
import { Menu, X, Home, GraduationCapIcon, BookOpen, Users, CreditCard } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className='navbar'>
      <div className='nav-inner container'>
        {/* Brand */}
        <a href='/' className='logo'>
          <span className='logo-accent'>Learn</span>Hub
        </a>

        {/* Desktop Links */}
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li>
            <a href='#hero'>
              <Home size={16} /> Home
            </a>
          </li>
          <li>
            <a href='#paths'>
              <BookOpen size={16} /> Paths
            </a>
          </li>
          <li>
            <a href='#courses'>
              <GraduationCapIcon size={16} /> Courses
            </a>
          </li>
          <li>
            <a href='#instructors'>
              <Users size={16} /> Instructors
            </a>
          </li>
          <li>
            <a href='#pricing'>
              <CreditCard size={16} /> Pricing
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className='nav-actions'>
          <input className='search-input' placeholder='Search courses...' />
          <a href='#signup' className='button button-primary'>
            Sign Up / Login
          </a>

          {/* Mobile Toggle */}
          <button
            className='mobile-toggle'
            aria-label='Toggle menu'
            onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
