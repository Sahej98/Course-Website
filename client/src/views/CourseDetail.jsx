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
  PlayCircle,
  ExternalLink,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Forum from '../components/Forum';
import QuizModal from '../components/QuizModal';
import ActiveAssignment from '../components/ActiveAssignment';
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
    getUserSubmissions,
    requestResubmission,
  } = useApp();

  const [activeTab, setActiveTab] = useState('modules');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [mySubmissions, setMySubmissions] = useState([]);

  // Modals state
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [confirmInfo, setConfirmInfo] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    loadCourse();
  }, [id, courses]);

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

    if (currentUser && foundCourse) {
      try {
        const subs = await getUserSubmissions(foundCourse._id);
        setMySubmissions(subs);
      } catch (e) {}
    }

    if (foundCourse && foundCourse.modules.length > 0) {
      setExpandedModules({ 0: true });
    }
    setIsLoading(false);
  };

  const isEnrolled = currentUser?.enrolledCourses?.some(
    (cid) => String(cid) === String(currentCourse?._id),
  );
  const isInstructor =
    currentUser?.role === 'TEACHER' || currentUser?.role === 'ADMIN';

  const showAlert = (title, message, type = 'info') =>
    setAlertInfo({ isOpen: true, title, message, type });

  const handleAssignmentStart = (assign) => {
    // Mobile Check for Anti-Cheat or General Assignment
    const isMobile = window.innerWidth <= 768;

    if (assign.antiCheat && isMobile) {
      showAlert(
        'Desktop Required',
        'This assignment has anti-cheat enabled and must be taken on a desktop computer.',
        'error',
      );
      return;
    }

    if (isMobile) {
      // Warning for normal assignments on mobile
      setConfirmInfo({
        isOpen: true,
        title: 'Mobile Warning',
        message:
          'It is recommended to take assignments on a desktop for the best experience. Continue anyway?',
        onConfirm: () => startAssignmentProcess(assign),
      });
      return;
    }

    startAssignmentProcess(assign);
  };

  const startAssignmentProcess = (assign) => {
    const fullAssignment = {
      ...assign,
      questions: assign.questions || [],
    };

    const sub = mySubmissions.find((s) => s.assignmentId === assign.id);
    if (sub && sub.status !== 'pending') {
      showAlert('Status', 'You have already submitted this assignment.');
      return;
    }
    setActiveAssignment(fullAssignment);
  };

  const handleAssignmentSubmit = async (content, force = false) => {
    try {
      const payloadContent = content.content;
      const payloadAnswers = content.answers;

      await submitAssignment(
        currentCourse._id,
        activeAssignment.id,
        payloadContent,
        payloadAnswers,
      );
      showAlert('Success', 'Assignment submitted successfully!', 'success');
      setActiveAssignment(null);
      // Refresh submissions
      const subs = await getUserSubmissions(currentCourse._id);
      setMySubmissions(subs);
    } catch (e) {
      showAlert('Error', 'Submission failed', 'error');
    }
  };

  const handleRequestResubmit = async (assign) => {
    const sub = mySubmissions.find((s) => s.assignmentId === assign.id);
    if (!sub) return;
    try {
      await requestResubmission(sub._id);
      showAlert(
        'Success',
        'Resubmission request sent to instructor.',
        'success',
      );
      const subs = await getUserSubmissions(currentCourse._id);
      setMySubmissions(subs);
    } catch (e) {
      showAlert('Error', 'Request failed', 'error');
    }
  };

  const toggleModule = (idx) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollCourse(currentCourse._id);
      showAlert(
        'Success',
        'You have successfully enrolled! Start learning below.',
        'success',
      );
    } catch (error) {
      showAlert('Error', 'Failed to enroll.', 'error');
    } finally {
      setEnrolling(false);
    }
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

  if (activeAssignment) {
    return (
      <ActiveAssignment
        assignment={activeAssignment}
        onSubmit={handleAssignmentSubmit}
        onCancel={() => setActiveAssignment(null)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '2.5rem' }}>
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
      />
      <ConfirmModal
        isOpen={confirmInfo.isOpen}
        onClose={() => setConfirmInfo((prev) => ({ ...prev, isOpen: false }))}
        {...confirmInfo}
      />
      {activeQuiz && (
        <QuizModal quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
      )}

      <div className='course-banner-new'>
        <div className='banner-text' style={{ flex: 1 }}>
          <button
            onClick={() => navigate('/courses')}
            className='btn btn-outline btn-sm'
            style={{
              marginBottom: '1rem',
              border: 'none',
              paddingLeft: 0,
              color: '#64748b',
            }}>
            <ArrowLeft size={16} /> Back to Courses
          </button>
          <h1
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '2.5rem',
              color: '#dc2626',
            }}>
            {currentCourse.title}
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#475569',
              marginBottom: '1.5rem',
              maxWidth: '700px',
            }}>
            {currentCourse.description ||
              'No description available for this course.'}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <div className='banner-badge'>
              <Clock size={16} /> {isEnrolled ? 'In Progress' : 'Not Enrolled'}
            </div>
            {!isEnrolled && !isInstructor && (
              <button
                onClick={handleEnroll}
                className='btn btn-primary'
                style={{ marginLeft: 'auto' }}>
                {enrolling ? 'Enrolling...' : 'Start Learning Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className='forum-layout'
        style={{
          alignItems: 'start',
          gridTemplateColumns: activeTab === 'discussion' ? '1fr' : undefined,
        }}>
        <div>
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '1.5rem',
            }}>
            <button
              onClick={() => setActiveTab('modules')}
              className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}>
              Modules & Materials
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}>
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}>
              Discussion Forum
            </button>
          </div>

          {activeTab === 'modules' && (
            <div className='learning-path-container'>
              <h3 style={{ marginBottom: '1rem', color: '#334155' }}>
                Course Materials
              </h3>
              {currentCourse.modules && currentCourse.modules.length > 0 ? (
                currentCourse.modules.map((module, idx) => (
                  <div
                    key={idx}
                    className='module-accordion'
                    style={{
                      marginBottom: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'white',
                    }}>
                    <div
                      onClick={() => toggleModule(idx)}
                      style={{
                        padding: '1.25rem',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '700',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}>
                        <div
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                          }}>
                          {idx + 1}
                        </div>
                        {module.title}
                      </div>
                      {expandedModules[idx] ? (
                        <ChevronDown size={20} color='#64748b' />
                      ) : (
                        <ChevronRight size={20} color='#64748b' />
                      )}
                    </div>
                    {expandedModules[idx] && (
                      <div style={{ padding: '0' }}>
                        {module.resources && module.resources.length > 0 ? (
                          module.resources.map((res, rIdx) => (
                            <div
                              key={rIdx}
                              style={{
                                padding: '1rem 1.5rem',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                              className='resource-item'>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '1rem',
                                }}>
                                {res.type === 'video' ? (
                                  <Video size={18} color='#2563eb' />
                                ) : (
                                  <FileText size={18} color='#f97316' />
                                )}
                                <div>
                                  <div
                                    style={{
                                      fontSize: '0.95rem',
                                      fontWeight: '500',
                                      color: '#334155',
                                    }}>
                                    {res.title}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.75rem',
                                      color: '#94a3b8',
                                      textTransform: 'capitalize',
                                    }}>
                                    {res.type} Resource
                                  </div>
                                </div>
                              </div>
                              {isEnrolled || isInstructor ? (
                                <button
                                  onClick={() => window.open(res.url, '_blank')}
                                  className='btn btn-sm btn-outline'
                                  style={{
                                    borderRadius: '99px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                  }}>
                                  {res.type === 'link'
                                    ? 'Open Link'
                                    : 'Download / View'}{' '}
                                  <ExternalLink size={12} />
                                </button>
                              ) : (
                                <Lock size={16} color='#cbd5e1' />
                              )}
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              padding: '1.5rem',
                              color: '#94a3b8',
                              fontStyle: 'italic',
                              textAlign: 'center',
                            }}>
                            No resources.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}>
                  No modules added yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className='learning-path-container'>
              <h3 style={{ margin: '0 0 1rem 0', color: '#334155' }}>
                Assignments
              </h3>
              {currentCourse.assignments &&
                currentCourse.assignments.map((assign, i) => {
                  const sub = mySubmissions.find(
                    (s) => s.assignmentId === assign.id,
                  );
                  const isSubmitted =
                    sub &&
                    (sub.status === 'submitted' || sub.status === 'graded');

                  return (
                    <div
                      key={i}
                      style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                          {assign.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Due: {assign.dueDate}{' '}
                          {assign.timeLimit > 0 && `• ${assign.timeLimit} mins`}
                        </div>
                        {sub && (
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color:
                                sub.status === 'graded' ? '#16a34a' : '#2563eb',
                              marginTop: '0.25rem',
                              fontWeight: 'bold',
                            }}>
                            Status: {sub.status.toUpperCase()}{' '}
                            {sub.grade !== null &&
                              `(${sub.grade}/${assign.totalPoints})`}
                            {sub.resubmissionRequested && (
                              <span
                                style={{
                                  color: '#ea580c',
                                  marginLeft: '0.5rem',
                                }}>
                                • Resubmission Requested
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isSubmitted &&
                          !sub.resubmissionRequested &&
                          sub.status !== 'pending' && (
                            <button
                              className='btn btn-outline btn-sm'
                              onClick={() => handleRequestResubmit(assign)}>
                              Request Resubmit
                            </button>
                          )}
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => handleAssignmentStart(assign)}
                          disabled={
                            (!isEnrolled && !isInstructor) ||
                            (isSubmitted && sub.status !== 'pending')
                          }
                          style={
                            (!isEnrolled && !isInstructor) ||
                            (isSubmitted && sub.status !== 'pending')
                              ? {
                                  background: '#e2e8f0',
                                  color: '#94a3b8',
                                  border: 'none',
                                }
                              : {}
                          }>
                          {isSubmitted && sub.status !== 'pending'
                            ? 'Completed'
                            : 'Start'}
                        </button>
                      </div>
                    </div>
                  );
                })}

              {currentCourse.quizzes &&
                currentCourse.quizzes.map((quiz, i) => (
                  <div
                    key={`q-${i}`}
                    style={{
                      padding: '1rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {quiz.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Quiz • {quiz.questions.length} Questions
                      </div>
                    </div>
                    <button
                      className='btn btn-primary btn-sm'
                      style={{ background: '#059669', borderColor: '#059669' }}
                      onClick={() => (isEnrolled ? setActiveQuiz(quiz) : null)}
                      disabled={!isEnrolled && !isInstructor}>
                      Take Quiz
                    </button>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'discussion' && <Forum courseId={currentCourse._id} />}
        </div>

        {activeTab !== 'discussion' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className='card'>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Instructor
              </h3>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentCourse.instructor}`}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                  }}
                  alt=''
                />
                <div>
                  <div style={{ fontWeight: '700' }}>
                    {currentCourse.instructor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseDetail;
