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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const { fetchAnalytics, currentUser } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);
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

  const handleOpenCalendar = () => {
    if (dateInputRef.current) dateInputRef.current.showPicker();
  };

  if (loading)
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!data) return <div>Failed to load data</div>;

  // Helpers for Chart
  const chartHeight = 150;
  const chartWidth = 600;
  // If student, we don't need the big area chart unless we want to map something else.
  // For Admin: Enrollment Trend
  const maxStudents =
    !isStudent && data.enrollmentTrend
      ? Math.max(...data.enrollmentTrend.map((d) => d.students)) * 1.2
      : 10;
  const getX = (index) =>
    (index / ((data.enrollmentTrend?.length || 1) - 1)) * chartWidth;
  const getY = (val) => chartHeight - (val / maxStudents) * chartHeight;
  const points =
    !isStudent && data.enrollmentTrend
      ? data.enrollmentTrend
          .map((d, i) => `${getX(i)},${getY(d.students)}`)
          .join(' ')
      : '';

  return (
    <div className='animate-fade-in'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
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
              : 'Overview of student performance and enrollment.'}
          </p>
        </div>
        <button className='btn btn-outline' onClick={handleDownloadReport}>
          <Download size={16} /> Export Report
        </button>
      </div>

      <div
        className='dashboard-grid analytics-grid'
        style={{
          gridTemplateColumns: '1.5fr 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
        {/* Left Column */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STUDENT VIEW: My Progress Cards */}
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
                  Across all graded assignments
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

          {/* ADMIN VIEW: Enrollment Chart */}
          {!isStudent && (
            <div className='card' style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}>
                <h3
                  style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                  Student Enrollment Over Time
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    position: 'relative',
                  }}>
                  <input
                    type='date'
                    ref={dateInputRef}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  <button
                    className='btn btn-sm'
                    style={{ background: '#eff6ff', color: '#2563eb' }}
                    onClick={handleOpenCalendar}>
                    <ClockIcon size={12} /> Last 6 Months
                  </button>
                </div>
              </div>
              <div
                style={{
                  position: 'relative',
                  height: '200px',
                  width: '100%',
                  overflow: 'hidden',
                }}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio='none'
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                  }}>
                  <defs>
                    <linearGradient
                      id='chartGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'>
                      <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.2' />
                      <stop offset='100%' stopColor='#3b82f6' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                  {[0, 0.33, 0.66, 1].map((p, i) => (
                    <line
                      key={i}
                      x1='0'
                      y1={chartHeight * p}
                      x2={chartWidth}
                      y2={chartHeight * p}
                      stroke='#f1f5f9'
                      strokeWidth='1'
                    />
                  ))}
                  <path
                    d={`M ${points} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
                    fill='url(#chartGradient)'
                    stroke='none'
                  />
                  <polyline
                    points={points}
                    fill='none'
                    stroke='#2563eb'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  {data.enrollmentTrend.map((d, i) => (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}>
                      <circle
                        cx={getX(i)}
                        cy={getY(d.students)}
                        r='6'
                        fill='white'
                        stroke='#2563eb'
                        strokeWidth='3'
                        style={{ cursor: 'pointer' }}
                      />
                      {hoveredPoint === i && (
                        <g>
                          <rect
                            x={getX(i) - 35}
                            y={getY(d.students) - 35}
                            width='70'
                            height='25'
                            rx='4'
                            fill='#1e293b'
                          />
                          <text
                            x={getX(i)}
                            y={getY(d.students) - 18}
                            textAnchor='middle'
                            fill='white'
                            fontSize='10'
                            fontWeight='bold'>
                            {d.students} Students
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                </svg>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    color: '#64748b',
                    fontSize: '0.8rem',
                  }}>
                  {data.enrollmentTrend.map((d, i) => (
                    <span key={i}>{d.month}</span>
                  ))}
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
                {isStudent ? 'My Learning Activity' : 'Global Activity Heatmap'}
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
          {/* STUDENT: Recent Graded Assignments */}
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

          {/* ADMIN: Assignment Stats */}
          {!isStudent && (
            <div className='card' style={{ padding: '0' }}>
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #f1f5f9',
                }}>
                <h3
                  style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                  Assignment Completion
                </h3>
              </div>
              {data.assignmentStats.map((assign, i) => (
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
                    <span style={{ fontWeight: 'bold' }}>
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
                        background: i === 0 ? '#f97316' : '#3b82f6',
                        height: '100%',
                        borderRadius: '4px',
                      }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADMIN: Top Students */}
          {!isStudent && (
            <div className='card' style={{ padding: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  margin: '0 0 1.5rem 0',
                }}>
                Top Performing Students
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                {data.topStudents.map((student, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}>
                      <img
                        src={student.avatar}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                        }}
                        alt=''
                      />
                      <span
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          color: '#334155',
                        }}>
                        {student.name}
                      </span>
                    </div>
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        color: '#0f172a',
                      }}>
                      {student.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <circle cx='12' cy='12' r='10'></circle>
    <polyline points='12 6 12 12 16 14'></polyline>
  </svg>
);

export default Analytics;
