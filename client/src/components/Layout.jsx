import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Users,
  LogOut,
  Bell,
  Menu,
  FileText,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive =
      location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));

    return (
      <Link to={path} className={`nav-item ${isActive ? 'active' : ''}`}>
        <Icon size={20} />
        {label}
      </Link>
    );
  };

  return (
    <div className='app-container'>
      {/* Sidebar */}
      <aside className='sidebar'>
        <div className='sidebar-header'>
          <div className='brand'>
            <span className='brand-icon'>E</span>
            EduSphere
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginTop: '0.5rem',
            }}>
            Intelligent Collaboration
          </p>
        </div>

        <nav className='nav-menu'>
          <p className='menu-label'>Menu</p>
          <NavItem icon={LayoutDashboard} label='Dashboard' path='/' />
          <NavItem icon={BookOpen} label='My Courses' path='/courses' />
          <NavItem icon={FileText} label='Assignments' path='/assignments' />
          <NavItem icon={BarChart2} label='Analytics' path='/analytics' />
          {currentUser && currentUser.role === 'ADMIN' && (
            <NavItem icon={Users} label='Admin Panel' path='/admin' />
          )}
        </nav>

        {currentUser && (
          <div className='user-profile'>
            <Link to='/profile' className='user-info'>
              <img src={currentUser.avatar} alt='User' className='avatar' />
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    margin: 0,
                  }}>
                  {currentUser.name}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    textTransform: 'capitalize',
                    margin: 0,
                  }}>
                  {currentUser.role.toLowerCase()}
                </p>
              </div>
            </Link>
            <button onClick={handleLogout} className='logout-btn'>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className='main-wrapper'>
        {/* Header */}
        <header className='top-header'>
          <div className='grid-header' style={{ display: 'none' }}>
            <Menu size={24} /> EduSphere
          </div>

          <div className='header-actions'>
            <button className='notification-btn'>
              <Bell size={20} />
              <span className='notification-badge'></span>
            </button>
            <div
              style={{
                height: '24px',
                width: '1px',
                background: '#e2e8f0',
              }}></div>

            <Link
              to='/profile'
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#475569',
                textDecoration: 'none',
              }}>
              {currentUser ? currentUser.name : 'Guest'}
            </Link>
          </div>
        </header>

        <div className='content-area'>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
