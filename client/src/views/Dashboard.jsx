import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Bell,
  Flame,
  FileText,
  Calendar,
  CheckCircle2,
  Trophy,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { courses, currentUser, getAllMySubmissions, fetchThreads } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State for real dashboard metrics
  const [metrics, setMetrics] = useState({
    pendingCount: 0,
    activeCourses: 0,
    avgScore: 0,
    upcomingTasks: [],
    recentThreads: [],
    completionRate: 0,
  });

  const isInstructor =
    currentUser.role === 'TEACHER' || currentUser.role === 'ADMIN';

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Identify My Courses
        const myCourses = isInstructor
          ? courses.filter((c) => c.instructorId === currentUser._id)
          : courses.filter(
              (c) =>
                currentUser.enrolledCourses &&
                currentUser.enrolledCourses.includes(c._id),
            );

        // 2. Fetch all my submissions to determine status
        let mySubmissions = [];
        if (!isInstructor) {
          mySubmissions = await getAllMySubmissions();
        }

        // 3. Calculate Pending Assignments & Upcoming Tasks
        let allAssignments = [];
        let submittedCount = 0;
        let gradedCount = 0;
        let totalScore = 0;

        myCourses.forEach((c) => {
          c.assignments.forEach((a) => {
            // Check status
            const sub = mySubmissions.find(
              (s) => s.assignmentId === a.id && s.courseId === c._id,
            );
            const isSubmitted = !!sub;
            const isGraded = sub && sub.status === 'graded';

            if (isSubmitted) submittedCount++;
            if (isGraded) {
              gradedCount++;
              totalScore += sub.grade || 0;
            }

            if (!isSubmitted) {
              allAssignments.push({
                title: a.title,
                dueDate: a.dueDate,
                courseTitle: c.title,
                icon: FileText,
                color: '#3b82f6', // Default blue
              });
            }
          });
        });

        // Sort by due date
        allAssignments.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
        );

        // 4. Fetch recent forum threads (Global or first course)
        let threads = [];
        if (myCourses.length > 0) {
          threads = await fetchThreads(myCourses[0]._id);
        } else {
          threads = await fetchThreads('all');
        }

        setMetrics({
          pendingCount: allAssignments.length,
          activeCourses: myCourses.length,
          avgScore: gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0,
          upcomingTasks: allAssignments.slice(0, 5), // Top 5 upcoming
          recentThreads: threads.slice(0, 3),
          completionRate:
            allAssignments.length + submittedCount > 0
              ? Math.round(
                  (submittedCount / (allAssignments.length + submittedCount)) *
                    100,
                )
              : 0,
        });
      } catch (error) {
        console.error('Dashboard load error', error);
      } finally {
        setLoading(false);
      }
    };

    if (courses.length > 0 || !loading) {
      loadData();
    }
  }, [courses, currentUser]);

  if (loading)
    return (
      <div className='flex justify-center p-12 text-muted'>
        Loading dashboard...
      </div>
    );

  return (
    <div className='animate-fade-in' style={{ paddingBottom: '2rem' }}>
      {/* 1. Welcome Banner */}
      <div className='welcome-banner'>
        <div className='banner-content'>
          <h1
            style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              background: 'linear-gradient(90deg, #dc2626, #991b1b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p
            style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '500px' }}>
            {metrics.pendingCount > 0
              ? `You have ${metrics.pendingCount} assignments pending. Keep up the momentum!`
              : "You're all caught up! Great job."}
          </p>
          <button
            className='btn btn-primary'
            style={{ marginTop: '1rem' }}
            onClick={() => navigate('/assignments')}>
            View Assignments <ChevronRight size={16} />
          </button>
        </div>
        <div className='banner-decoration'></div>
        <div className='banner-img'>
          <img
            src='https://cdni.iconscout.com/illustration/premium/thumb/online-education-5986333-4972754.png'
            alt='Learning'
            style={{ height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className='grid-4' style={{ marginBottom: '2rem' }}>
        {/* Active Courses */}
        <div
          className='stat-card blue'
          onClick={() => navigate('/courses')}
          style={{ cursor: 'pointer' }}>
          <BookOpen size={24} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {metrics.activeCourses}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Active Courses</div>
          <BookOpen size={80} className='stat-icon-bg' />
        </div>

        {/* Pending Assignments */}
        <div
          className='stat-card orange'
          onClick={() => navigate('/assignments')}
          style={{ cursor: 'pointer' }}>
          <AlertCircle size={24} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {metrics.pendingCount}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Assignments Due
          </div>
          <AlertCircle size={80} className='stat-icon-bg' />
        </div>

        {/* Quiz Scores / Avg Grade */}
        <div className='stat-card green'>
          <Trophy size={24} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {metrics.avgScore}%
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Average Score</div>
          <Trophy size={80} className='stat-icon-bg' />
        </div>

        {/* Upcoming Deadlines Count */}
        <div className='stat-card red'>
          <Calendar size={24} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {metrics.upcomingTasks.length}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Due Soon</div>
          <Calendar size={80} className='stat-icon-bg' />
        </div>
      </div>

      {/* 3. Main Grid Layout */}
      <div className='dashboard-grid'>
        {/* Left Column */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Continue Learning / Course List */}
          <div className='card'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
              <h3 style={{ margin: 0 }}>My Courses</h3>
              <Link
                to='/courses'
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}>
                View All
              </Link>
            </div>

            {metrics.activeCourses > 0 ? (
              <div>
                {courses
                  .filter((c) => currentUser.enrolledCourses?.includes(c._id))
                  .slice(0, 3)
                  .map((course) => (
                    <div key={course._id} className='course-list-item'>
                      <div style={{ minWidth: '200px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>
                          {course.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {course.modules.length} Modules • Instructor:{' '}
                          {course.instructor.split(' ')[0]}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}>
                        <div className='progress-track'>
                          <div
                            className='progress-fill-blue'
                            style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <button
                          onClick={() => navigate(`/courses/${course._id}`)}
                          className='btn btn-primary btn-sm'>
                          Resume
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}>
                No active courses.{' '}
                <Link to='/courses' className='text-primary font-bold'>
                  Enroll now
                </Link>
              </div>
            )}
          </div>

          {/* Quick Start Quiz Banner */}
          <div
            className='card'
            style={{
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              border: '1px solid #bfdbfe',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  background: 'white',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                }}>
                <HelpCircle size={24} className='text-primary' />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                  Quick Start Quiz
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                  Test your knowledge with a new quiz
                </p>
              </div>
            </div>
            <button
              className='btn btn-primary'
              style={{ background: '#1e40af' }}>
              Start Quiz
            </button>
          </div>

          {/* Upcoming Deadlines List */}
          <div className='card'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
              <h3 style={{ margin: 0 }}>Upcoming Deadlines</h3>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/assignments')}>
                View All
              </span>
            </div>
            <div>
              {metrics.upcomingTasks.length > 0 ? (
                metrics.upcomingTasks.map((task, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0',
                      borderBottom:
                        idx !== metrics.upcomingTasks.length - 1
                          ? '1px solid #f1f5f9'
                          : 'none',
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}>
                      <div
                        style={{
                          background: `${task.color}20`,
                          color: task.color,
                          padding: '0.5rem',
                          borderRadius: '8px',
                        }}>
                        <task.icon size={18} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            color: '#334155',
                            fontSize: '0.9rem',
                          }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {task.courseTitle}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        fontWeight: '500',
                      }}>
                      Due: {task.dueDate}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    padding: '1rem',
                  }}>
                  No upcoming deadlines.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Discussion Forum */}
          <div className='card'>
            <h3 style={{ marginBottom: '1rem' }}>Recent Discussions</h3>
            {metrics.recentThreads.length > 0 ? (
              <div>
                {metrics.recentThreads.map((thread) => (
                  <div
                    key={thread._id}
                    className='discussion-item'
                    onClick={() => navigate(`/forum/thread/${thread._id}`)}
                    style={{ cursor: 'pointer' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'start',
                      }}>
                      <Flame
                        size={16}
                        className='text-primary'
                        style={{ marginTop: '2px', flexShrink: 0 }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#334155',
                            lineHeight: '1.4',
                          }}>
                          {thread.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          by {thread.authorName}
                        </div>
                      </div>
                    </div>
                    <span className='reply-badge'>
                      {thread.comments.length}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <Link
                    to={
                      courses.length > 0
                        ? `/courses/${courses[0]._id}`
                        : '/courses'
                    }
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}>
                    View Forum <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem 0',
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                }}>
                No recent discussions found.
              </div>
            )}
          </div>

          {/* Your Progress */}
          <div className='card'>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Progress</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}>
                  Assignment Completion
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#0f172a',
                  }}>
                  {metrics.completionRate}%
                </div>
              </div>

              <div
                className='donut-chart'
                style={{
                  background: `conic-gradient(var(--primary) 0% ${metrics.completionRate}%, #e2e8f0 ${metrics.completionRate}% 100%)`,
                }}>
                <div className='donut-inner'>
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#0f172a',
                    }}>
                    {metrics.completionRate}%
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
              <button
                className='btn btn-primary btn-sm'
                onClick={() => navigate('/analytics')}>
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
