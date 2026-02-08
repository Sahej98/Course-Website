import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Lock,
  Loader2,
  Award,
  Video,
  File,
  FileText,
  Users,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Forum from '../components/Forum';
import QuizModal from '../components/QuizModal';
import {
  AlertModal,
  PromptModal,
  ConfirmModal,
} from '../components/CustomModals';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    courses,
    fetchCourseById,
    currentUser,
    enrollCourse,
    submitAssignment,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [promptInfo, setPromptInfo] = useState({
    isOpen: false,
    title: '',
    label: '',
    onSubmit: () => {},
  });
  const [confirmInfo, setConfirmInfo] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      let foundCourse = courses.find((c) => c._id === id);

      if (!foundCourse) {
        try {
          foundCourse = await fetchCourseById(id);
        } catch (err) {
          console.error('Course load error', err);
        }
      }
      setCurrentCourse(foundCourse);
      setIsLoading(false);
    };
    loadCourse();
  }, [id, courses]);

  const isEnrolled = currentUser?.enrolledCourses?.includes(currentCourse?._id);
  const isInstructor =
    currentUser?.role === 'TEACHER' || currentUser?.role === 'ADMIN';

  const showAlert = (title, message, type = 'info') =>
    setAlertInfo({ isOpen: true, title, message, type });
  const closeAlert = () => setAlertInfo((prev) => ({ ...prev, isOpen: false }));

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollCourse(currentCourse._id);
      showAlert(
        'Success',
        'You have successfully enrolled in the course!',
        'success',
      );
    } catch (error) {
      showAlert('Error', 'Failed to enroll in the course.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleMessageInstructor = () => {
    setPromptInfo({
      isOpen: true,
      title: 'Message Instructor',
      label: 'Your Message:',
      placeholder: 'Type your message here...',
      onSubmit: (val) => {
        if (!val.trim()) return;
        // Mock sending message
        showAlert(
          'Message Sent',
          'Your message has been sent to the instructor.',
          'success',
        );
      },
    });
  };

  const handleStartQuiz = (quiz) => {
    if (!isEnrolled && !isInstructor) {
      showAlert(
        'Access Denied',
        'You must be enrolled to take this quiz.',
        'error',
      );
      return;
    }
    setConfirmInfo({
      isOpen: true,
      message: `Are you ready to start "${quiz.title}"?`,
      onConfirm: () => setActiveQuiz(quiz),
    });
  };

  const handleSubmitAssignment = (assign) => {
    if (!isEnrolled && !isInstructor) {
      showAlert(
        'Access Denied',
        'Enroll in the course to submit assignments.',
        'error',
      );
      return;
    }
    setPromptInfo({
      isOpen: true,
      title: `Submit: ${assign.title}`,
      label: 'Paste your work or link:',
      placeholder: 'https://docs.google.com/...',
      onSubmit: async (val) => {
        if (!val) return;
        try {
          await submitAssignment(currentCourse._id, assign.id, val);
          showAlert(
            'Submitted',
            'Assignment submitted successfully!',
            'success',
          );
        } catch (e) {
          showAlert('Error', 'Submission failed. Please try again.', 'error');
        }
      },
    });
  };

  if (isLoading)
    return (
      <div className='flex justify-center p-12'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!currentCourse)
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center' }}>
        Course not found
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '2.5rem' }}>
      {/* Modals */}
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={closeAlert}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
      />
      <PromptModal
        isOpen={promptInfo.isOpen}
        onClose={() => setPromptInfo((prev) => ({ ...prev, isOpen: false }))}
        {...promptInfo}
      />
      <ConfirmModal
        isOpen={confirmInfo.isOpen}
        onClose={() => setConfirmInfo((prev) => ({ ...prev, isOpen: false }))}
        {...confirmInfo}
      />
      {activeQuiz && (
        <QuizModal quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
      )}

      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#64748b',
          }}>
          <Link
            to='/courses'
            style={{ textDecoration: 'none', color: 'inherit' }}>
            My Courses
          </Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: '600' }}>
            {currentCourse.title}
          </span>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className='btn btn-primary'
          style={{ padding: '0.5rem 1rem', background: '#f97316' }}>
          <ArrowLeft size={16} /> Back to Courses
        </button>
      </div>

      {/* Banner */}
      <div className='course-banner-new'>
        <div className='banner-monitor'>
          <img
            src='https://cdni.iconscout.com/illustration/premium/thumb/web-development-2974925-2477356.png'
            alt='Monitor'
            style={{ width: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className='banner-text' style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
            }}>
            <h1 style={{ margin: 0 }}>{currentCourse.title}</h1>
          </div>
          <div className='banner-badge'>
            <Clock size={14} /> {isEnrolled ? 'In Progress' : 'Not Enrolled'}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>
              Instructor:{' '}
              <span style={{ fontSize: '1.1rem' }}>
                {currentCourse.instructor}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='tab-nav'>
        {['overview', 'materials', 'assignments', 'quizzes', 'discussions'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}>
              {tab}
            </button>
          ),
        )}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className='course-overview-grid'>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              className='card'
              style={{ background: '#f8fafc', border: 'none' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Course Status</h4>
              <div
                style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}>
                <Clock size={16} />{' '}
                {isEnrolled ? 'In Progress' : 'Not Enrolled'}
              </div>
              {!isEnrolled && !isInstructor && (
                <button
                  onClick={handleEnroll}
                  className='btn btn-primary w-full'
                  style={{ marginTop: '1rem' }}>
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
            <div className='instructor-card'>
              <h4 style={{ margin: '0 0 1rem 0', textAlign: 'left' }}>
                Instructor
              </h4>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentCourse.instructor}`}
                alt='Instructor'
                className='instructor-avatar'
              />
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {currentCourse.instructor}
              </div>
              <button
                className='btn btn-primary w-full'
                style={{
                  fontSize: '0.8rem',
                  background: '#1e40af',
                  marginTop: '1rem',
                }}
                onClick={handleMessageInstructor}>
                Message Instructor
              </button>
            </div>
          </div>

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
              Course Curriculum
            </h3>
            {currentCourse.modules && currentCourse.modules.length > 0 ? (
              currentCourse.modules.map((module, idx) => (
                <div key={idx} className='curriculum-row'>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='week-label'>Module {idx + 1}</div>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>
                      {module.title}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}>
                    {isEnrolled || isInstructor ? (
                      <button
                        className='btn btn-primary btn-sm'
                        style={{ background: '#1e40af' }}
                        onClick={() => setActiveTab('materials')}>
                        View
                      </button>
                    ) : (
                      <button
                        className='btn btn-outline btn-sm'
                        onClick={() =>
                          showAlert(
                            'Locked',
                            'Enroll to view content.',
                            'error',
                          )
                        }>
                        <Lock size={12} /> Locked
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center p-8 text-muted border-dashed border rounded'>
                No curriculum modules added.
              </div>
            )}
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className='card'>
              <h4 style={{ margin: '0 0 1rem 0' }}>Progress</h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}>
                  <FileText size={16} color='#f97316' />{' '}
                  <span style={{ fontWeight: '600' }}>
                    {currentCourse.assignments?.length}
                  </span>{' '}
                  Assignments
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}>
                  <Award size={16} color='#16a34a' />{' '}
                  <span style={{ fontWeight: '600' }}>
                    {currentCourse.quizzes?.length}
                  </span>{' '}
                  Quizzes
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISCUSSIONS TAB */}
      {activeTab === 'discussions' && <Forum courseId={currentCourse._id} />}

      {/* ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && (
        <div className='card'>
          <h3 style={{ marginBottom: '1.5rem' }}>Assignments</h3>
          {currentCourse.assignments?.map((a, i) => (
            <div key={i} className='assignment-item'>
              <div
                className='assign-icon'
                style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <FileText size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {a.description || 'No description'}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginTop: '0.25rem',
                  }}>
                  Due: {a.dueDate}
                </div>
              </div>
              <button
                className='btn btn-primary btn-sm'
                onClick={() => handleSubmitAssignment(a)}>
                Submit
              </button>
            </div>
          ))}
          {(!currentCourse.assignments ||
            currentCourse.assignments.length === 0) && (
            <div className='text-center text-muted'>No assignments.</div>
          )}
        </div>
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className='card'>
          <h3 style={{ marginBottom: '1.5rem' }}>Quizzes</h3>
          {currentCourse.quizzes?.map((q, i) => (
            <div key={i} className='assignment-item'>
              <div
                className='assign-icon'
                style={{ background: '#dcfce7', color: '#16a34a' }}>
                <Award size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {q.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {q.questions?.length} Questions • {q.totalPoints} Points
                </div>
              </div>
              <button
                className='btn btn-primary btn-sm'
                style={{ background: '#16a34a' }}
                onClick={() => handleStartQuiz(q)}>
                Start Quiz
              </button>
            </div>
          ))}
          {(!currentCourse.quizzes || currentCourse.quizzes.length === 0) && (
            <div className='text-center text-muted'>No quizzes.</div>
          )}
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className='grid-3'>
          {currentCourse.modules?.map((m) =>
            m.resources?.map((r, i) => (
              <div
                key={i}
                className='card p-4 flex items-center gap-3'
                style={{ cursor: 'pointer' }}
                onClick={() => window.open(r.url, '_blank')}>
                <div className='p-2 bg-blue-50 text-blue-600 rounded'>
                  {r.type === 'video' ? (
                    <Video size={20} />
                  ) : (
                    <File size={20} />
                  )}
                </div>
                <div>
                  <div className='font-bold'>{r.title}</div>
                  <div className='text-xs text-muted capitalize'>
                    {r.type} (Click to Open)
                  </div>
                </div>
              </div>
            )),
          )}
          {(!currentCourse.modules ||
            currentCourse.modules.every((m) => m.resources.length === 0)) && (
            <div className='text-center text-muted col-span-3'>
              No materials available.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CourseDetail;
