import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import CourseCard from '../components/CourseCard';
import {
  Mail,
  Shield,
  Calendar,
  BookOpen,
  CheckCircle,
  Award,
  Edit2,
  Upload,
  Camera,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FormModal, AlertModal } from '../components/CustomModals';

const Profile = () => {
  const {
    currentUser,
    courses,
    updateProfile,
    uploadFile,
    getAllMySubmissions,
  } = useApp();
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    avgGrade: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    password: '',
    avatar: '',
  });
  const [uploading, setUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Filter courses based on role
  const relevantCourses =
    currentUser.role === 'TEACHER' || currentUser.role === 'ADMIN'
      ? courses.filter((c) => c.instructorId === currentUser._id)
      : courses.filter(
          (c) =>
            currentUser.enrolledCourses &&
            currentUser.enrolledCourses.includes(c._id),
        );

  useEffect(() => {
    const loadStats = async () => {
      if (currentUser.role === 'STUDENT') {
        const completed = relevantCourses.filter(
          (c) => c.progress === 100,
        ).length;
        const inProgress = relevantCourses.filter(
          (c) => c.progress > 0 && c.progress < 100,
        ).length;

        try {
          const subs = await getAllMySubmissions();
          const gradedSubs = subs.filter((s) => s.status === 'graded');
          const avg =
            gradedSubs.length > 0
              ? Math.round(
                  gradedSubs.reduce((acc, curr) => acc + (curr.grade || 0), 0) /
                    gradedSubs.length,
                )
              : 0;
          setStats({ completed, inProgress, avgGrade: avg });
        } catch (e) {
          setStats({ completed, inProgress, avgGrade: 0 });
        }
      } else {
        setStats({
          completed: relevantCourses.length,
          inProgress: 0,
          avgGrade: 0,
        });
      }
    };
    loadStats();
  }, [currentUser, courses]);

  const handleEditClick = () => {
    setEditForm({
      name: currentUser.name,
      password: '',
      avatar: currentUser.avatar,
    });
    setIsEditing(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setEditForm({ ...editForm, avatar: res.url });
    } catch (e) {
      setAlertInfo({
        isOpen: true,
        title: 'Error',
        message: 'Failed to upload image',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(editForm);
      setAlertInfo({
        isOpen: true,
        title: 'Success',
        message: 'Profile updated successfully!',
        type: 'success',
      });
      setIsEditing(false);
    } catch (e) {
      setAlertInfo({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update profile',
        type: 'error',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='animate-fade-in'
      style={{ paddingBottom: '2rem' }}>
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
        {...alertInfo}
      />

      {/* Edit Profile Modal */}
      <FormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title='Edit Profile'
        onSubmit={handleUpdate}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100px',
              height: '100px',
              margin: '0 auto',
            }}>
            <img
              src={editForm.avatar || currentUser.avatar}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e2e8f0',
              }}
              alt=''
            />
            <label
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#0f172a',
                color: 'white',
                borderRadius: '50%',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
              }}>
              {uploading ? (
                <div
                  className='spinner'
                  style={{ width: '14px', height: '14px' }}></div>
              ) : (
                <Camera size={16} />
              )}
              <input
                type='file'
                hidden
                onChange={handleAvatarUpload}
                accept='image/*'
              />
            </label>
          </div>
        </div>
        <div className='form-group'>
          <label className='form-label'>Full Name</label>
          <input
            className='input-field'
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>New Password (Optional)</label>
          <input
            className='input-field'
            type='password'
            value={editForm.password}
            onChange={(e) =>
              setEditForm({ ...editForm, password: e.target.value })
            }
            placeholder='Leave blank to keep current'
          />
        </div>
        <button className='btn btn-primary w-full'>Save Changes</button>
      </FormModal>

      {/* Profile Header Card */}
      <div
        className='card'
        style={{
          padding: '0',
          overflow: 'hidden',
          marginBottom: '2rem',
          border: 'none',
          position: 'relative',
        }}>
        {/* Banner Image */}
        <div
          style={{
            height: '220px',
            background: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`,
          }}></div>

        <div
          style={{
            padding: '0 2rem 2rem 2rem',
            marginTop: '-60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '2rem',
                flexWrap: 'wrap',
              }}>
              <div style={{ position: 'relative', marginTop: '-40px' }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    border: '6px solid white',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    background: 'white',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: '24px',
                    height: '24px',
                    background: '#10b981',
                    border: '3px solid white',
                    borderRadius: '50%',
                  }}></div>
              </div>
              <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
                <h1
                  style={{
                    fontSize: '2.2rem',
                    margin: 0,
                    lineHeight: 1.1,
                    fontWeight: '800',
                    color: '#0f172a',
                  }}>
                  {currentUser.name}
                </h1>
                <p
                  style={{
                    margin: '0.5rem 0 0 0',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                  }}>
                  <Mail size={16} /> {currentUser.email}
                </p>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <button
                className='btn btn-outline'
                onClick={handleEditClick}
                style={{ background: 'white' }}>
                <Edit2 size={16} /> Edit Profile
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #f1f5f9',
              marginTop: '0.5rem',
            }}>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}>
                Role
              </div>
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
                  padding: '0.3rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                <Shield size={14} /> {currentUser.role}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}>
                Joined
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#334155',
                  fontWeight: '600',
                }}>
                <Calendar size={18} />{' '}
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}>
                User ID
              </div>
              <div
                style={{
                  color: '#334155',
                  fontFamily: 'monospace',
                  background: '#f1f5f9',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}>
                {currentUser._id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid-3' style={{ marginBottom: '2.5rem' }}>
        <div
          className='card'
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div
              style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: 1 }}>
              {relevantCourses.length}
            </div>
            <div
              style={{
                color: '#64748b',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginTop: '0.25rem',
              }}>
              Active Courses
            </div>
          </div>
        </div>
        {currentUser.role === 'STUDENT' && (
          <>
            <div
              className='card'
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CheckCircle size={28} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    lineHeight: 1,
                  }}>
                  {stats.completed}
                </div>
                <div
                  style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginTop: '0.25rem',
                  }}>
                  Courses Completed
                </div>
              </div>
            </div>
            <div
              className='card'
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#fff7ed',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TrendingUp size={28} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    lineHeight: 1,
                  }}>
                  {stats.avgGrade}%
                </div>
                <div
                  style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginTop: '0.25rem',
                  }}>
                  Average Score
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
        <h2
          style={{
            fontSize: '1.5rem',
            margin: 0,
            fontWeight: '800',
            color: '#1e293b',
          }}>
          {currentUser.role === 'STUDENT' ? 'My Learning Path' : 'My Courses'}
        </h2>
      </div>

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
            padding: '4rem',
            borderStyle: 'dashed',
            background: 'transparent',
          }}>
          <BookOpen
            size={48}
            color='#cbd5e1'
            style={{ margin: '0 auto 1rem' }}
          />
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            No courses found.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
