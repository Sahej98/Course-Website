import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Search,
  Trash2,
  Edit,
  Loader2,
  Plus,
  Users,
  BookOpen,
  FileText,
  BarChart2,
} from 'lucide-react';
import { ConfirmModal, AlertModal } from '../components/CustomModals';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { fetchAllUsers, deleteUser, fetchAdminStats, fetchAdminCourses } =
    useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    userCount: 0,
    courseCount: 0,
    engagement: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [confirm, setConfirm] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, statsData, coursesData] = await Promise.all([
        fetchAllUsers(),
        fetchAdminStats(),
        fetchAdminCourses(),
      ]);
      setUsers(usersData);
      setStats(statsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirm({
      isOpen: true,
      message:
        'Are you sure you want to delete this user? This cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteUser(userId);
          setUsers(users.filter((u) => u._id !== userId));
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'User deleted.',
          });
        } catch (error) {
          setAlert({
            isOpen: true,
            title: 'Error',
            message: 'Failed to delete user.',
          });
        }
      },
    });
  };

  if (loading)
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='animate-spin' />
      </div>
    );

  return (
    <div
      className='animate-fade-in'
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={() => setConfirm((prev) => ({ ...prev, isOpen: false }))}
        {...confirm}
      />
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        {...alert}
      />

      <div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '0.5rem',
          }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#64748b' }}>
          Manage users, courses, discussions, and site settings.
        </p>
      </div>

      <div className='grid-4'>
        <div
          className='card'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
          }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Users size={24} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                fontWeight: '600',
              }}>
              Active Users
            </div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#0f172a',
              }}>
              {stats.userCount}
            </div>
          </div>
        </div>
        <div
          className='card'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
          }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                fontWeight: '600',
              }}>
              Total Courses
            </div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#0f172a',
              }}>
              {stats.courseCount}
            </div>
          </div>
        </div>
        {/* ... other stats cards remain similar ... */}
      </div>

      <div
        className='grid-2'
        style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className='admin-table-container'>
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>User Overview</h3>
            <button
              className='btn btn-primary btn-sm'
              style={{ background: '#3b82f6' }}
              onClick={() => navigate('/register')}>
              <Plus size={14} /> Add User
            </button>
          </div>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((user) => (
                <tr key={user._id}>
                  <td
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}>
                    <img
                      src={user.avatar}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                      }}
                      alt=''
                    />
                    {user.name}
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className='admin-table-container'>
            <div
              style={{
                padding: '1.25rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                Course Management
              </h3>
              <button
                className='btn btn-primary btn-sm'
                style={{ background: '#16a34a' }}
                onClick={() => navigate('/courses/new')}>
                <Plus size={14} /> Add Course
              </button>
            </div>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.title}</td>
                    <td>{c.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
