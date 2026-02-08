import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setCurrentUser(data);
      await fetchCourses();
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses');
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
    await api.post('/auth/logout');
    setCurrentUser(null);
    setCourses([]);
  };

  const enrollCourse = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      // Refresh user to update enrolledCourses
      const { data } = await api.get('/auth/me');
      setCurrentUser(data);
      return true;
    } catch (error) {
      throw error;
    }
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

  // Submissions
  const submitAssignment = async (courseId, assignmentId, content) => {
    const { data } = await api.post('/submissions', {
      courseId,
      assignmentId,
      content,
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
        enrollCourse,
        submitAssignment,
        getUserSubmissions,
        getAllMySubmissions,
        getCourseSubmissions,
        gradeSubmission,
        fetchThreads,
        fetchThreadById,
        fetchForumStats,
        createThread,
        replyThread,
        resolveThread,
        fetchAnalytics,
        fetchAllUsers,
        fetchAdminCourses,
        deleteUser,
        fetchAdminStats,
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
