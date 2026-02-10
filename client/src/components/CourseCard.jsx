import React, { useState } from 'react';
import {
  User,
  Clock,
  CheckCircle,
  Settings,
  Play,
  BookOpen,
  Edit,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertModal } from './CustomModals';

const CourseCard = ({ course, loading: skeleton }) => {
  const navigate = useNavigate();
  const { currentUser, enrollCourse } = useApp();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Skeleton Loader
  if (skeleton) {
    return (
      <div
        className='course-card-new'
        style={{ border: 'none', boxShadow: 'none' }}>
        <div
          className='skeleton'
          style={{ height: '180px', width: '100%' }}></div>
        <div style={{ padding: '1.5rem' }}>
          <div
            className='skeleton'
            style={{
              height: '24px',
              width: '70%',
              marginBottom: '1rem',
            }}></div>
          <div
            className='skeleton'
            style={{
              height: '16px',
              width: '40%',
              marginBottom: '1rem',
            }}></div>
          <div
            className='skeleton'
            style={{ height: '40px', width: '100%' }}></div>
        </div>
      </div>
    );
  }

  // Logic Determinations
  const isInstructor =
    currentUser?._id === course.instructorId ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'TEACHER';

  // Robust check for enrollment (handle String vs ObjectId comparisons)
  const isEnrolled = currentUser?.enrolledCourses?.some(
    (id) => String(id) === String(course._id),
  );
  const isCompleted = isEnrolled && course.progress === 100;

  // Handlers
  const handleEnroll = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await enrollCourse(course._id);
      setAlert({
        isOpen: true,
        title: 'Success',
        message: 'Enrolled successfully!',
        type: 'success',
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Enrollment failed.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        {...alert}
      />

      <div
        className='course-card-new'
        onClick={() => navigate(`/courses/${course._id}`)}
        style={{
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}>
        <div className='cc-thumb' style={{ height: '200px' }}>
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ filter: 'brightness(0.95)' }}
          />

          {/* Badges Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              }}>
              <BookOpen size={12} /> {course.modules?.length || 0} Modules
            </span>
            {isEnrolled && (
              <span
                style={{
                  background: isCompleted ? '#16a34a' : '#f59e0b',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}>
                {isCompleted ? 'Completed' : 'Enrolled'}
              </span>
            )}
          </div>
        </div>

        <div
          className='cc-body'
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
          <h3
            className='cc-title'
            style={{
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
              lineHeight: 1.3,
            }}>
            {course.title}
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#f1f5f9',
              }}
              alt='Instructor'
            />
            <span
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                fontWeight: '500',
              }}>
              {course.instructor}
            </span>
          </div>

          {isEnrolled && (
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  marginBottom: '0.4rem',
                }}>
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div
                style={{
                  height: '6px',
                  background: '#f1f5f9',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}>
                <div
                  style={{
                    width: `${course.progress}%`,
                    background: '#dc2626',
                    height: '100%',
                    borderRadius: '10px',
                  }}></div>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid #f8fafc',
            }}>
            {isInstructor ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/${course._id}/edit`);
                }}
                className='btn-resume'
                style={{
                  width: '100%',
                  background: '#0f172a',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Edit size={16} /> Manage
              </button>
            ) : isEnrolled ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/${course._id}`);
                }}
                className='btn-resume'
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Play size={16} /> Continue Learning
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className='btn'
                style={{
                  width: '100%',
                  border: '1px solid #dc2626',
                  color: '#dc2626',
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  fontWeight: '700',
                }}>
                {loading ? (
                  'Enrolling...'
                ) : (
                  <>
                    <PlusCircle size={16} /> Enroll Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;
