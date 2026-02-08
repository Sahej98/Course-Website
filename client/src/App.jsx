import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import CourseDetail from './views/CourseDetail';
import CourseForm from './views/CourseForm';
import AdminPanel from './views/AdminPanel';
import AnalyticsComponent from './components/Analytics';
import CourseCard from './components/CourseCard';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import Assignments from './views/Assignments';
import ThreadDetail from './views/ThreadDetail';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Forum from './components/Forum';

const CourseList = () => {
  const { courses, currentUser } = useApp();
  const canCreate =
    currentUser?.role === 'TEACHER' || currentUser?.role === 'ADMIN';
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    // Mock category check as course doesn't have category field yet, assume 'all' for now or check title
    const matchesCategory =
      filterCategory === 'all'
        ? true
        : course.title.toLowerCase().includes(filterCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingBottom: '2rem' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '0.5rem',
          }}>
          My Courses
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Manage and participate in your courses here.
        </p>
      </div>

      {/* Toolbar */}
      <div className='courses-toolbar'>
        <div className='search-wrapper'>
          <Search className='search-icon' size={20} />
          <input
            className='search-input'
            placeholder='Search courses...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='filter-group'>
          <select
            className='filter-select'
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}>
            <option value='all'>All Categories</option>
            <option value='development'>Development</option>
            <option value='design'>Design</option>
            <option value='business'>Business</option>
          </select>

          <select
            className='filter-select'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}>
            <option value='recent'>Sort By: Most Recent</option>
            <option value='progress'>Sort By: Progress</option>
            <option value='title'>Sort By: Title</option>
          </select>

          {canCreate && (
            <Link
              to='/courses/new'
              className='btn btn-primary'
              style={{ whiteSpace: 'nowrap' }}>
              <Plus size={18} /> Create New Course
            </Link>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className='grid-3'>
          {filteredCourses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </motion.div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useApp();
  const location = useLocation();

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  if (!currentUser)
    return <Navigate to='/login' state={{ from: location }} replace />;

  return <Layout>{children}</Layout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/courses'
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/courses/new'
          element={
            <ProtectedRoute>
              <CourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='/courses/:id'
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path='/courses/:id/edit'
          element={
            <ProtectedRoute>
              <CourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='/assignments'
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forum/thread/:id'
          element={
            <ProtectedRoute>
              <ThreadDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path='/analytics'
          element={
            <ProtectedRoute>
              <AnalyticsComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AppProvider>
        <AnimatedRoutes />
      </AppProvider>
    </Router>
  );
};

export default App;
