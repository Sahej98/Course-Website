import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

// For split deployment (Vercel + Render), we must use the absolute URL from env vars in production.
// In dev, we fallback to localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Setup Axios Interceptor to handle 401s automatically
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Only clear user if we actually had one, to avoid loops on public pages if we had them
          if (currentUser) setCurrentUser(null);
        }
        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [currentUser]);

  // 1. Check Auth ONLY on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // 2. Poll for notifications ONLY when currentUser exists
  useEffect(() => {
    if (!currentUser) return;

    // Fetch immediately
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setCurrentUser(data);
      await fetchCourses();
    } catch (error) {
      console.warn('Auth check failed or server unavailable.');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (e) {
      console.error('Notifs error');
    }
  };

  const markNotificationRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(
      notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses.');
    }
  };

  const fetchCourseById = async (id) => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setCurrentUser(data);
    await fetchCourses();
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    setCurrentUser(data);
    await fetchCourses();
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      /* ignore */
    }
    setCurrentUser(null);
    setCourses([]);
    setNotifications([]);
  };

  const updateProfile = async (userData) => {
    const { data } = await api.put('/auth/update', userData);
    setCurrentUser(data);
    return data;
  };

  const enrollCourse = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      const { data } = await api.get('/auth/me');
      setCurrentUser(data);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Upload
  const uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        if (onProgress) onProgress(percentCompleted);
      },
    });
    return data;
  };

  // Course Management
  const createCourse = async (courseData) => {
    const { data } = await api.post('/courses', courseData);
    setCourses([...courses, data]);
    return data;
  };

  const updateCourse = async (id, courseData) => {
    const { data } = await api.put(`/courses/${id}`, courseData);
    setCourses(courses.map((c) => (c._id === id ? data : c)));
    return data;
  };

  const deleteCourse = async (id) => {
    await api.delete(`/courses/${id}`);
    setCourses(courses.filter((c) => c._id !== id));
  };

  const bulkCreateCourses = async (coursesData) => {
    const { data } = await api.post('/courses/bulk', coursesData);
    await fetchCourses();
    return data;
  };

  // Submissions
  const submitAssignment = async (courseId, assignmentId, content, answers) => {
    const { data } = await api.post('/submissions', {
      courseId,
      assignmentId,
      content,
      answers,
    });
    return data;
  };

  const getUserSubmissions = async (courseId) => {
    const { data } = await api.get(`/submissions/my/${courseId}`);
    return data;
  };

  const getAllMySubmissions = async () => {
    const { data } = await api.get('/submissions/my');
    return data;
  };

  const getCourseSubmissions = async (courseId) => {
    const { data } = await api.get(`/submissions/course/${courseId}`);
    return data;
  };

  const gradeSubmission = async (submissionId, grade, feedback) => {
    const { data } = await api.put(`/submissions/${submissionId}/grade`, {
      grade,
      feedback,
    });
    return data;
  };

  const requestResubmission = async (submissionId) => {
    await api.post(`/submissions/${submissionId}/request-resubmit`);
  };

  const approveResubmission = async (submissionId) => {
    await api.post(`/submissions/${submissionId}/approve-resubmit`);
  };

  // Forum
  const fetchThreads = async (courseId) => {
    const { data } = await api.get(`/forum/${courseId}`);
    return data;
  };

  const fetchThreadById = async (threadId) => {
    const { data } = await api.get(`/forum/thread/${threadId}`);
    return data;
  };

  const fetchForumStats = async () => {
    const { data } = await api.get(`/forum/stats/global`);
    return data;
  };

  const createThread = async (courseId, title, content, tags) => {
    const { data } = await api.post('/forum', {
      courseId,
      title,
      content,
      tags,
    });
    return data;
  };

  const replyThread = async (threadId, content) => {
    const { data } = await api.post(`/forum/${threadId}/reply`, { content });
    return data;
  };

  const resolveThread = async (threadId) => {
    const { data } = await api.put(`/forum/${threadId}/resolve`);
    return data;
  };

  // Analytics & Admin
  const fetchAnalytics = async () => {
    const { data } = await api.get('/analytics');
    return data;
  };

  const fetchAllUsers = async () => {
    const { data } = await api.get('/admin/users');
    return data;
  };

  const adminCreateUser = async (userData) => {
    const { data } = await api.post('/admin/users', userData);
    return data;
  };

  const adminBulkCreateUsers = async (usersData) => {
    const { data } = await api.post('/admin/users/bulk', usersData);
    return data;
  };

  const adminUpdateUser = async (id, userData) => {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data;
  };

  const fetchAdminCourses = async () => {
    const { data } = await api.get('/admin/courses');
    return data;
  };

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
  };

  const fetchAdminStats = async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        courses,
        fetchCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        bulkCreateCourses,
        enrollCourse,
        submitAssignment,
        getUserSubmissions,
        getAllMySubmissions,
        getCourseSubmissions,
        gradeSubmission,
        requestResubmission,
        approveResubmission,
        fetchThreads,
        fetchThreadById,
        fetchForumStats,
        createThread,
        replyThread,
        resolveThread,
        fetchAnalytics,
        fetchAllUsers,
        adminCreateUser,
        adminBulkCreateUsers,
        adminUpdateUser,
        fetchAdminCourses,
        deleteUser,
        fetchAdminStats,
        uploadFile,
        notifications,
        markNotificationRead,
        updateProfile,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
