import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  ChevronRight,
  FileText,
  Calendar,
  Trophy,
  AlertCircle,
  Users,
  CheckSquare,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const {
    courses,
    currentUser,
    getAllMySubmissions,
    fetchAnalytics,
    loading: appLoading,
  } = useApp();
  const navigate = useNavigate();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Dashboard Metrics
  const [stats, setStats] = useState({
    card1: { label: '', value: 0, icon: BookOpen, color: 'blue' },
    card2: { label: '', value: 0, icon: AlertCircle, color: 'orange' },
    card3: { label: '', value: 0, icon: Trophy, color: 'green' },
    card4: { label: '', value: 0, icon: Calendar, color: 'red' },
    mainList: [],
    sideList: [],
  });

  const isStudent = currentUser?.role === 'STUDENT';
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    // Wait for the main app to finish initial loading (auth check)
    if (appLoading) return;

    const loadData = async () => {
      try {
        // Fetch real analytics from backend to get accurate aggregate data
        const analyticsData = await fetchAnalytics();

        if (isStudent) {
          // --- STUDENT LOGIC ---
          // Only show enrolled courses
          const myCourses = courses.filter((c) =>
            currentUser.enrolledCourses?.includes(c._id),
          );
          const mySubmissions = await getAllMySubmissions();

          // Calculate Stats based on real data
          let pendingCount = 0;
          let upcomingTasks = [];

          myCourses.forEach((c) => {
            c.assignments.forEach((a) => {
              const sub = mySubmissions.find(
                (s) => s.assignmentId === a.id && s.courseId === c._id,
              );
              if (!sub) {
                pendingCount++;
                upcomingTasks.push({
                  ...a,
                  courseTitle: c.title,
                  courseId: c._id,
                });
              }
            });
          });

          upcomingTasks.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
          );

          setStats({
            card1: {
              label: 'Enrolled Courses',
              value: analyticsData.activeCourses || myCourses.length,
              icon: BookOpen,
              color: 'blue',
            },
            card2: {
              label: 'Pending Tasks',
              value: pendingCount,
              icon: AlertCircle,
              color: 'orange',
            },
            card3: {
              label: 'Average Grade',
              value: analyticsData.avgGrade + '%',
              icon: Trophy,
              color: 'green',
            },
            card4: {
              label: 'Completion Rate',
              value: analyticsData.completionRate + '%',
              icon: CheckSquare,
              color: 'red',
            },
            mainList: myCourses, // Only enrolled
            sideList: upcomingTasks.slice(0, 5),
          });
        } else {
          // --- INSTRUCTOR / ADMIN LOGIC ---
          // Filter logic handled in analytics endpoint, here we just filter list for display
          const myTeachingCourses = isAdmin
            ? courses // Admin sees all
            : courses.filter((c) => c.instructorId === currentUser._id); // Teacher sees own

          setStats({
            card1: {
              label: 'Total Courses',
              value: analyticsData.totalCourses || myTeachingCourses.length,
              icon: BookOpen,
              color: 'blue',
            },
            card2: {
              label: 'Total Students',
              value: analyticsData.activeUsers || 0,
              icon: Users,
              color: 'green',
            },
            card3: {
              label: 'Submissions',
              value: analyticsData.totalSubmissions || 0,
              icon: FileText,
              color: 'orange',
            },
            card4: {
              label: 'Avg Engagement',
              value: (analyticsData.engagement || 0) + '%',
              icon: TrendingUp,
              color: 'red',
            },
            mainList: myTeachingCourses,
            sideList: [],
          });
        }
      } catch (error) {
        console.error('Dashboard load error', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadData();
  }, [courses, currentUser, appLoading]);

  if (appLoading || dashboardLoading)
    return (
      <div className='flex justify-center p-12 text-muted'>
        Loading dashboard...
      </div>
    );

  return (
    <div className='animate-fade-in' style={{ paddingBottom: '2rem' }}>
      {/* Welcome Banner */}
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
            {isStudent
              ? 'Welcome Back,'
              : isAdmin
                ? 'Admin Dashboard,'
                : 'Instructor Dashboard,'}{' '}
            {currentUser.name.split(' ')[0]}
          </h1>
          <p
            style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '500px' }}>
            {isStudent
              ? `You have ${stats.card2.value} assignments pending. Stay on track!`
              : isAdmin
                ? 'Overview of system performance and user statistics.'
                : 'Manage your courses, track student progress, and grade assignments.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {isStudent ? (
              <button
                className='btn btn-primary'
                onClick={() => navigate('/courses')}>
                Browse Courses <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className='btn btn-primary'
                onClick={() => navigate('/courses/new')}>
                <Plus size={16} /> Create Course
              </button>
            )}
          </div>
        </div>
        <div className='banner-decoration'></div>
      </div>

      {/* Stats Row */}
      <div className='grid-4' style={{ marginBottom: '2rem' }}>
        {[stats.card1, stats.card2, stats.card3, stats.card4].map((card, i) => (
          <div key={i} className={`stat-card ${card.color}`}>
            <card.icon
              size={24}
              style={{ marginBottom: '0.5rem', opacity: 0.8 }}
            />
            <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
              {card.value}
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
              {card.label}
            </div>
            <card.icon size={80} className='stat-icon-bg' />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className='dashboard-grid'>
        {/* Left: Course List */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className='card'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}>
              <h3 style={{ margin: 0 }}>
                {isStudent ? 'My Enrolled Courses' : 'Recent Courses'}
              </h3>
              <Link
                to='/courses'
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}>
                View All
              </Link>
            </div>

            {stats.mainList.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                {stats.mainList.slice(0, 4).map((course) => (
                  <div
                    key={course._id}
                    className='course-list-item'
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                    }}>
                    <div style={{ minWidth: '200px' }}>
                      <div
                        style={{
                          fontWeight: '700',
                          color: '#1e293b',
                          fontSize: '1rem',
                        }}>
                        {course.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {isStudent
                          ? `Instructor: ${course.instructor}`
                          : `${course.studentCount || 0} Students Enrolled`}
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
                      {isStudent && (
                        <div
                          className='progress-track'
                          style={{ height: '8px' }}>
                          <div
                            className='progress-fill-blue'
                            style={{
                              width: `${course.progress}%`,
                              background: '#dc2626',
                            }}></div>
                        </div>
                      )}
                      <button
                        onClick={() =>
                          navigate(
                            isStudent
                              ? `/courses/${course._id}`
                              : `/courses/${course._id}/edit`,
                          )
                        }
                        className='btn btn-outline btn-sm'
                        style={{ whiteSpace: 'nowrap' }}>
                        {isStudent ? 'Resume' : 'Manage'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                  border: '2px dashed #e2e8f0',
                  borderRadius: '12px',
                }}>
                <p>No courses found.</p>
                <button
                  className='btn btn-primary btn-sm'
                  onClick={() =>
                    navigate(isStudent ? '/courses' : '/courses/new')
                  }>
                  {isStudent
                    ? 'Enroll in a Course'
                    : 'Create Your First Course'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tasks / Activity */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isStudent && (
            <div className='card'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}>
                <h3 style={{ margin: 0 }}>Upcoming Deadlines</h3>
              </div>
              <div>
                {stats.sideList.length > 0 ? (
                  stats.sideList.map((task, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          background: '#eff6ff',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          minWidth: '50px',
                        }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#3b82f6',
                            fontWeight: 'bold',
                          }}>
                          DUE
                        </span>
                        <span
                          style={{
                            fontSize: '1rem',
                            fontWeight: '800',
                            color: '#1e3a8a',
                          }}>
                          {task.dueDate.split('-')[2]}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
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
                      <button
                        className='btn btn-primary btn-sm'
                        style={{ padding: '0.25rem 0.5rem' }}
                        onClick={() => navigate(`/courses/${task.courseId}`)}>
                        View
                      </button>
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
          )}

          {!isStudent && (
            <div className='card'>
              <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                <button
                  className='btn btn-outline w-full'
                  style={{
                    justifyContent: 'flex-start',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                  }}
                  onClick={() => navigate('/courses/new')}>
                  <Plus size={18} className='text-primary' /> Create New Course
                </button>
                <button
                  className='btn btn-outline w-full'
                  style={{
                    justifyContent: 'flex-start',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                  }}
                  onClick={() => navigate('/analytics')}>
                  <TrendingUp size={18} className='text-primary' /> View
                  Analytics
                </button>
                {isAdmin && (
                  <button
                    className='btn btn-outline w-full'
                    style={{
                      justifyContent: 'flex-start',
                      border: '1px solid #e2e8f0',
                      color: '#475569',
                    }}
                    onClick={() => navigate('/admin')}>
                    <Users size={18} className='text-primary' /> User Management
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
