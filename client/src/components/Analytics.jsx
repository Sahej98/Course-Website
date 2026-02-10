import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Loader2,
  Download,
  MoreHorizontal,
  Database,
  FileText,
  CheckCircle,
  ArrowRight,
  BarChart2,
  TrendingUp,
  Award,
  Users,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const { fetchAnalytics, currentUser } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dateInputRef = useRef(null);

  const isStudent = currentUser?.role === 'STUDENT';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAnalytics();
        setData(res);
      } catch (e) {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDownloadReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!data) return <div>Failed to load data</div>;

  return (
    <div className='animate-fade-in'>
      <div className='responsive-header' style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: 0,
            }}>
            {isStudent ? 'My Performance' : 'Analytics Dashboard'}
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            {isStudent
              ? 'Track your personal learning progress.'
              : 'Overview of course performance.'}
          </p>
        </div>
        <button className='btn btn-outline' onClick={handleDownloadReport}>
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className='analytics-layout'>
        {/* Left Column */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STUDENT VIEW */}
          {isStudent && (
            <div className='grid-2'>
              <div
                className='card'
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                  }}>
                  <div>
                    <h3 style={{ color: 'white', opacity: 0.9 }}>Avg. Grade</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      {data.avgGrade}%
                    </div>
                  </div>
                  <Award size={32} style={{ opacity: 0.5 }} />
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.9rem',
                    opacity: 0.8,
                  }}>
                  Across graded assignments
                </div>
              </div>
              <div
                className='card'
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                  }}>
                  <div>
                    <h3 style={{ color: 'white', opacity: 0.9 }}>Completion</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      {data.completionRate}%
                    </div>
                  </div>
                  <CheckCircle size={32} style={{ opacity: 0.5 }} />
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.9rem',
                    opacity: 0.8,
                  }}>
                  {data.totalSubmissions} assignments submitted
                </div>
              </div>
            </div>
          )}

          {/* ADMIN/TEACHER VIEW: Key Metrics */}
          {!isStudent && (
            <div className='grid-2'>
              <div className='card' style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div>
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}>
                      Total Courses
                    </h3>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#0f172a',
                      }}>
                      {data.totalCourses}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: '#eff6ff',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                    }}>
                    <BookOpen size={24} />
                  </div>
                </div>
              </div>
              <div className='card' style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div>
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}>
                      Total Enrolled
                    </h3>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#0f172a',
                      }}>
                      {data.totalEnrolled}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: '#f0fdf4',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#16a34a',
                    }}>
                    <Users size={24} />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                  }}>
                  <span style={{ color: '#16a34a' }}>
                    Completed: {data.completedStudents}
                  </span>
                  <span style={{ color: '#ea580c' }}>
                    Ongoing: {data.ongoingStudents}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SHARED: Activity Heatmap */}
          <div className='card' style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                {isStudent ? 'My Learning Activity' : 'Submission Activity'}
              </h3>
              <MoreHorizontal size={16} color='#94a3b8' />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '6px',
              }}>
              {data.heatmapData.map((d, i) => (
                <div
                  key={i}
                  title={`${d.date}: ${d.count} submissions`}
                  className='heatmap-cell'
                  style={{
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '4px',
                    background:
                      d.count === 0
                        ? '#f1f5f9'
                        : d.count < 2
                          ? '#bfdbfe'
                          : d.count < 4
                            ? '#60a5fa'
                            : '#2563eb',
                    cursor: 'pointer',
                  }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STUDENT: Recent Graded */}
          {isStudent && (
            <div className='card' style={{ padding: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  margin: '0 0 1.5rem 0',
                }}>
                Recent Grades
              </h3>
              {data.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((act, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '0.5rem',
                    }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        {act.title || 'Assignment'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {act.courseTitle}
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: act.score >= 80 ? '#16a34a' : '#ca8a04',
                      }}>
                      {act.score}%
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8' }}>
                  No graded assignments yet.
                </div>
              )}
            </div>
          )}

          {/* ADMIN: Assignment Stats (Low Completion only) */}
          {!isStudent && (
            <div className='card' style={{ padding: '0' }}>
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #f1f5f9',
                }}>
                <h3
                  style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                  Assignments Needing Attention
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Lowest completion rates
                </p>
              </div>
              {data.assignmentStats && data.assignmentStats.length > 0 ? (
                data.assignmentStats.map((assign, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1rem 1.5rem',
                      borderBottom: '1px solid #f1f5f9',
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        {assign.title}
                      </span>
                      <span style={{ fontWeight: 'bold', color: '#ea580c' }}>
                        {assign.completionRate}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                      }}>
                      <div
                        style={{
                          width: `${assign.completionRate}%`,
                          background: '#ea580c',
                          height: '100%',
                          borderRadius: '4px',
                        }}></div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        marginTop: '0.25rem',
                      }}>
                      {assign.courseTitle}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', color: '#94a3b8' }}>
                  All assignments have high completion rates!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
