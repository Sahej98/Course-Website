import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Trash2,
  Plus,
  Users,
  BookOpen,
  Edit2,
  Upload,
  X,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ConfirmModal,
  AlertModal,
  FormModal,
} from '../components/CustomModals';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const {
    fetchAllUsers,
    deleteUser,
    fetchAdminStats,
    fetchAdminCourses,
    adminCreateUser,
    adminBulkCreateUsers,
    adminUpdateUser,
    deleteCourse,
    uploadFile,
    bulkCreateCourses,
  } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    userCount: 0,
    courseCount: 0,
    engagement: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // Modals
  const [confirm, setConfirm] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Forms
  const [userForm, setUserForm] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    avatar: '',
  });
  const [bulkData, setBulkData] = useState('');
  const [uploading, setUploading] = useState(false);

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

  const handleEditUser = (user) => {
    setUserForm({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      password: '', // Don't show password
    });
    setShowUserModal(true);
  };

  const handleCreateUserClick = () => {
    setUserForm({
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'STUDENT',
      avatar: '',
    });
    setShowUserModal(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setUserForm({ ...userForm, avatar: res.url });
    } catch (e) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Failed to upload image',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUserSubmit = async () => {
    try {
      if (userForm.id) {
        await adminUpdateUser(userForm.id, userForm);
        setAlert({ isOpen: true, title: 'Success', message: 'User updated.' });
      } else {
        await adminCreateUser(userForm);
        setAlert({ isOpen: true, title: 'Success', message: 'User created.' });
      }
      setShowUserModal(false);
      loadData();
    } catch (e) {
      setAlert({ isOpen: true, title: 'Error', message: 'Operation failed.' });
    }
  };

  const handleBulkSubmit = async () => {
    try {
      const parsed = JSON.parse(bulkData);
      if (!Array.isArray(parsed))
        throw new Error('Data must be an array of objects');

      if (activeTab === 'users') {
        await adminBulkCreateUsers(parsed);
        setAlert({
          isOpen: true,
          title: 'Success',
          message: 'Users imported successfully.',
        });
      } else {
        await bulkCreateCourses(parsed);
        setAlert({
          isOpen: true,
          title: 'Success',
          message: 'Courses imported successfully.',
        });
      }
      setShowBulkModal(false);
      setBulkData('');
      loadData();
    } catch (e) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Invalid JSON format or server error.',
      });
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        // Simple CSV to JSON logic (Assumes headers on first row)
        if (file.name.endsWith('.csv')) {
          const csv = evt.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map((h) => h.trim());
          const result = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const obj = {};
            const currentline = lines[i].split(',');
            for (let j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j]?.trim();
            }
            result.push(obj);
          }
          setBulkData(JSON.stringify(result, null, 2));
        } else {
          // Assume JSON
          const json = JSON.parse(evt.target.result);
          setBulkData(JSON.stringify(json, null, 2));
        }
      } catch (err) {
        setAlert({
          isOpen: true,
          title: 'Error',
          message: 'Failed to parse file.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteUser = (userId) => {
    setConfirm({
      isOpen: true,
      message: 'Are you sure you want to delete this user?',
      onConfirm: async () => {
        await deleteUser(userId);
        setUsers(users.filter((u) => u._id !== userId));
      },
    });
  };

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

      {/* User Modal */}
      <FormModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={userForm.id ? 'Edit User' : 'Add New User'}
        onSubmit={handleUserSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img
            src={userForm.avatar || 'https://placehold.co/100'}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '0.5rem',
            }}
            alt=''
          />
          <br />
          <label
            className='btn btn-outline btn-sm'
            style={{ cursor: 'pointer' }}>
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload size={14} /> Upload Photo
              </>
            )}
            <input
              type='file'
              hidden
              onChange={handleAvatarUpload}
              accept='image/*'
            />
          </label>
        </div>
        <div className='form-group'>
          <label className='form-label'>Name</label>
          <input
            className='input-field'
            required
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Email</label>
          <input
            className='input-field'
            type='email'
            required
            value={userForm.email}
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>
            {userForm.id ? 'New Password (Optional)' : 'Password'}
          </label>
          <input
            className='input-field'
            type='password'
            required={!userForm.id}
            value={userForm.password}
            onChange={(e) =>
              setUserForm({ ...userForm, password: e.target.value })
            }
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Role</label>
          <select
            className='input-field'
            value={userForm.role}
            onChange={(e) =>
              setUserForm({ ...userForm, role: e.target.value })
            }>
            <option value='STUDENT'>Student</option>
            <option value='TEACHER'>Instructor</option>
            <option value='ADMIN'>Admin</option>
          </select>
        </div>
        <button className='btn btn-primary w-full'>
          {userForm.id ? 'Update User' : 'Create User'}
        </button>
      </FormModal>

      {/* Bulk Import Modal */}
      <FormModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title={`Bulk Import ${activeTab === 'users' ? 'Users' : 'Courses'}`}
        onSubmit={handleBulkSubmit}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <label
            className='btn btn-outline'
            style={{ cursor: 'pointer', width: '100%' }}>
            <FileSpreadsheet size={16} /> Upload CSV or JSON
            <input
              type='file'
              hidden
              accept='.json,.csv'
              onChange={handleFileImport}
            />
          </label>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#64748b',
              marginTop: '0.5rem',
            }}>
            {activeTab === 'users'
              ? 'Format: name, email, password, role'
              : 'Format: title, description, thumbnail'}
          </p>
        </div>
        <div className='form-group'>
          <label className='form-label'>Or Paste JSON Data</label>
          <textarea
            className='textarea-field'
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder='[{"name": "John", "email": "..."}]'
            style={{
              minHeight: '200px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          />
        </div>
        <button className='btn btn-primary w-full'>Import Data</button>
      </FormModal>

      {/* Admin Stats */}
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
      </div>

      {/* Tabs */}
      <div className='tab-nav'>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}>
          User Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}>
          Course Management
        </button>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div className='admin-table-container'>
          <div className='admin-header'>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>All Users</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className='btn btn-outline btn-sm'
                onClick={() => setShowBulkModal(true)}>
                <FileSpreadsheet size={14} /> Bulk Import
              </button>
              <button
                className='btn btn-primary btn-sm'
                onClick={handleCreateUserClick}>
                <Plus size={14} /> Add User
              </button>
            </div>
          </div>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td
                    data-label='User'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}>
                    <img
                      src={user.avatar}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                      }}
                      alt=''
                    />
                    {user.name}
                  </td>
                  <td data-label='Email'>{user.email}</td>
                  <td data-label='Role'>
                    <span
                      className={`status-pill ${user.role === 'ADMIN' ? 'completed' : 'locked'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td data-label='Action'>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'flex-end',
                      }}>
                      <button
                        onClick={() => handleEditUser(user)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#2563eb',
                          cursor: 'pointer',
                        }}>
                        <Edit2 size={16} />
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className='admin-table-container'>
          <div className='admin-header'>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>All Courses</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className='btn btn-outline btn-sm'
                onClick={() => setShowBulkModal(true)}>
                <FileSpreadsheet size={14} /> Bulk Import
              </button>
              <button
                className='btn btn-primary btn-sm'
                onClick={() => navigate('/courses/new')}>
                <Plus size={14} /> Add Course
              </button>
            </div>
          </div>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Students</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={i}>
                  <td data-label='Thumbnail'>
                    <img
                      src={c.thumbnail}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        objectFit: 'cover',
                      }}
                      alt=''
                    />
                  </td>
                  <td data-label='Course'>{c.title}</td>
                  <td data-label='Instructor'>{c.instructor}</td>
                  <td data-label='Enrolled'>{c.studentCount}</td>
                  <td data-label='Action'>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'flex-end',
                      }}>
                      <button
                        onClick={() => navigate(`/courses/${c._id}/edit`)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#2563eb',
                          cursor: 'pointer',
                        }}>
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteCourse(c._id)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
