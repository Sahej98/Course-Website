import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Users,
  LogOut,
  Bell,
  Menu,
  ChevronRight,
  User,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { currentUser, logout, notifications, markNotificationRead } = useApp();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive =
      location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));
    return (
      <Link
        to={path}
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}>
        <Icon size={20} />
        {label}
      </Link>
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className='app-container'>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className='mobile-overlay'
          onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div
          className='sidebar-header'
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src='/logo.png'
                style={{ width: '36px', height: '36px' }}
                alt='Logo'
              />
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '900',
                  color: '#0f172a',
                  letterSpacing: '-0.5px',
                }}>
                EduSphere
              </span>
            </div>
            <button
              className='mobile-close-btn'
              onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        <nav className='nav-menu'>
          <p className='menu-label'>Main Menu</p>
          <NavItem icon={LayoutDashboard} label='Dashboard' path='/' />
          <NavItem icon={BookOpen} label='All Courses' path='/courses' />
          <NavItem icon={BarChart2} label='Analytics' path='/analytics' />
          {currentUser && currentUser.role === 'ADMIN' && (
            <NavItem icon={Users} label='Admin Panel' path='/admin' />
          )}
        </nav>

        {currentUser && (
          <div className='user-profile'>
            <Link
              to='/profile'
              className='user-info'
              onClick={() => setMobileMenuOpen(false)}>
              <img src={currentUser.avatar} alt='User' className='avatar' />
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    margin: 0,
                    fontSize: '0.9rem',
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

      <main className='main-wrapper'>
        <header className='top-header'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className='mobile-menu-btn'
              onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} color='#0f172a' />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: '#64748b',
              }}
              className='breadcrumb'>
              <span>Home</span>
              <ChevronRight size={14} />
              <span style={{ fontWeight: '600', color: '#0f172a' }}>
                EduSphere
              </span>
            </div>
          </div>

          <div className='header-actions' style={{ position: 'relative' }}>
            <button
              className='notification-btn'
              onClick={() => setShowNotifs(!showNotifs)}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className='notification-badge'>{unreadCount}</span>
              )}
            </button>

            {showNotifs && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '300px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '0.5rem',
                  zIndex: 100,
                }}>
                <h4
                  style={{
                    padding: '0.5rem',
                    margin: 0,
                    borderBottom: '1px solid #f1f5f9',
                  }}>
                  Notifications
                </h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 && (
                    <p
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '0.8rem',
                      }}>
                      No notifications
                    </p>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markNotificationRead(n._id)}
                      style={{
                        padding: '0.75rem',
                        borderBottom: '1px solid #f1f5f9',
                        background: n.read ? 'white' : '#f0f9ff',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}>
                      {n.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className='content-area'>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
