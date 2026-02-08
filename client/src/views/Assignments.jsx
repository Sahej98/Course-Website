import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AlertModal, PromptModal } from '../components/CustomModals';

const Assignments = () => {
  const { courses, currentUser, getAllMySubmissions, submitAssignment } =
    useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [prompt, setPrompt] = useState({
    isOpen: false,
    title: '',
    label: '',
    onSubmit: () => {},
  });

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // 1. Get enrolled courses
        const myCourses =
          currentUser.role === 'TEACHER' || currentUser.role === 'ADMIN'
            ? courses.filter((c) => c.instructorId === currentUser._id)
            : courses.filter((c) =>
                currentUser.enrolledCourses?.includes(c._id),
              );

        // 2. Get Submissions (only if student)
        let mySubmissions = [];
        if (currentUser.role === 'STUDENT') {
          mySubmissions = await getAllMySubmissions();
        }

        // 3. Flatten
        const flattened = [];
        myCourses.forEach((c) => {
          c.assignments.forEach((a) => {
            const sub = mySubmissions.find(
              (s) => s.assignmentId === a.id && s.courseId === c._id,
            );
            let status = 'Pending';
            if (sub) status = sub.status === 'graded' ? 'Graded' : 'Submitted';
            if (new Date(a.dueDate) < new Date() && status === 'Pending')
              status = 'Overdue';

            flattened.push({
              id: a.id,
              title: a.title,
              course: c.title,
              courseId: c._id,
              dueDate: a.dueDate,
              status: status,
              icon: FileText,
              color: '#3b82f6',
              bgColor: '#eff6ff',
              grade: sub?.grade,
            });
          });
        });
        setAssignmentsList(flattened);
      } catch (error) {
        console.error('Error loading assignments', error);
      } finally {
        setLoading(false);
      }
    };

    if (courses.length > 0 || !loading) loadAssignments();
  }, [courses, currentUser]);

  const filteredAssignments = assignmentsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'All' || item.status === filterStatus),
  );

  const handleSubmitClick = (assign) => {
    setPrompt({
      isOpen: true,
      title: `Submit: ${assign.title}`,
      label: 'Paste your work or link:',
      placeholder: 'https://docs.google.com/...',
      onSubmit: async (val) => {
        if (!val) return;
        try {
          await submitAssignment(assign.courseId, assign.id, val);
          setAlert({
            isOpen: true,
            title: 'Success',
            message: 'Assignment submitted!',
            type: 'success',
          });
          setAssignmentsList((prev) =>
            prev.map((a) =>
              a.id === assign.id && a.courseId === assign.courseId
                ? { ...a, status: 'Submitted' }
                : a,
            ),
          );
        } catch (e) {
          setAlert({
            isOpen: true,
            title: 'Error',
            message: 'Submission failed.',
            type: 'error',
          });
        }
      },
    });
  };

  const handleViewGraded = (assign) => {
    setAlert({
      isOpen: true,
      title: 'Assignment Graded',
      message: `You scored ${assign.grade} on this assignment.`,
      type: 'success',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='animate-fade-in'>
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        {...alert}
      />
      <PromptModal
        isOpen={prompt.isOpen}
        onClose={() => setPrompt((prev) => ({ ...prev, isOpen: false }))}
        {...prompt}
      />

      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '0.5rem',
          }}>
          Assignments
        </h1>
        <p style={{ color: '#64748b' }}>
          Track and manage your course assignments efficiently.
        </p>
      </div>

      <div className='courses-toolbar'>
        <div className='search-wrapper'>
          <Search className='search-icon' size={20} />
          <input
            className='search-input'
            placeholder='Search assignments...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='filter-group'>
          <select
            className='filter-select'
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value='All'>Due Status</option>
            <option value='Pending'>Pending</option>
            <option value='Submitted'>Submitted</option>
            <option value='Graded'>Graded</option>
            <option value='Overdue'>Overdue</option>
          </select>
        </div>
      </div>

      <div className='forum-layout'>
        <div>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assign, idx) => (
              <div key={idx} className='assignment-item'>
                <div
                  className='assign-icon'
                  style={{ background: assign.bgColor, color: assign.color }}>
                  <assign.icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    {assign.title}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    <FileText size={14} /> {assign.course} • Due:{' '}
                    {assign.dueDate}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.5rem',
                    minWidth: '160px',
                  }}>
                  <span
                    className={`status-badge ${assign.status.toLowerCase()}`}>
                    {assign.status === 'Graded' ? (
                      <CheckCircle size={14} />
                    ) : assign.status === 'Overdue' ? (
                      <AlertCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}{' '}
                    {assign.status}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {assign.status === 'Pending' ||
                    assign.status === 'Overdue' ? (
                      <button
                        className='btn btn-primary btn-sm'
                        style={{ background: '#1e40af' }}
                        onClick={() => handleSubmitClick(assign)}>
                        Submit
                      </button>
                    ) : (
                      <button
                        className='btn btn-primary btn-sm'
                        style={{ background: '#3b82f6', opacity: 0.7 }}
                        onClick={() => handleViewGraded(assign)}>
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#94a3b8',
              }}>
              No assignments found.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Assignments;
