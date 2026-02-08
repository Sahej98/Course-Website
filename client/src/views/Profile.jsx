import React from 'react';
import { useApp } from '../context/AppContext';
import CourseCard from '../components/CourseCard';
import { Mail, Shield, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { currentUser, courses } = useApp();

  // Filter courses based on role
  const relevantCourses =
    currentUser.role === 'TEACHER' || currentUser.role === 'ADMIN'
      ? courses.filter((c) => c.instructorId === currentUser._id)
      : courses.filter(
          (c) =>
            currentUser.enrolledCourses &&
            currentUser.enrolledCourses.includes(c._id),
        );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='animate-fade-in'
      style={{ paddingBottom: '2rem' }}>
      {/* Profile Header */}
      <div className='profile-header'>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className='profile-avatar-lg'
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>{currentUser.name}</h1>
            <span
              style={{
                background:
                  currentUser.role === 'ADMIN'
                    ? '#f3e8ff'
                    : currentUser.role === 'TEACHER'
                      ? '#dbeafe'
                      : '#dcfce7',
                color:
                  currentUser.role === 'ADMIN'
                    ? '#7e22ce'
                    : currentUser.role === 'TEACHER'
                      ? '#1d4ed8'
                      : '#15803d',
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }}>
              {currentUser.role}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '1rem',
              color: '#64748b',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> {currentUser.email}
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Joined{' '}
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} /> ID: {currentUser._id.substring(0, 8)}...
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        {currentUser.role === 'STUDENT' ? 'My Learning Path' : 'My Courses'}
      </h2>

      {relevantCourses.length > 0 ? (
        <div className='grid-3'>
          {relevantCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div
          className='card'
          style={{
            textAlign: 'center',
            padding: '3rem',
            borderStyle: 'dashed',
          }}>
          <p style={{ color: '#94a3b8' }}>
            {currentUser.role === 'STUDENT'
              ? "You haven't enrolled in any courses yet."
              : "You haven't created any courses yet."}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
