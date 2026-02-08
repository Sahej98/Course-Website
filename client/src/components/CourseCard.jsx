import React from 'react';
import { User, Clock, CheckCircle, Settings, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const isCompleted = course.progress === 100;

  // Mock active students for display if not available (since the API model doesn't return count directly yet)
  const activeStudents = Math.floor(Math.random() * 50) + 20;

  return (
    <div className='course-card-new'>
      <div className='cc-thumb'>
        <img src={course.thumbnail} alt={course.title} />
        <div className={`cc-badge ${isCompleted ? 'completed' : 'progress'}`}>
          {isCompleted ? <CheckCircle size={12} /> : <Clock size={12} />}
          {isCompleted ? 'Completed' : 'In Progress'}
        </div>
      </div>

      <div className='cc-body'>
        {/* Mock category if not present */}
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#dc2626',
            textTransform: 'uppercase',
          }}>
          Development
        </div>

        <h3 className='cc-title'>{course.title}</h3>

        <div className='cc-instructor'>
          {/* Mock avatar for instructor if not linked directly or simple icon */}
          <div
            style={{
              width: '24px',
              height: '24px',
              background: '#f1f5f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <User size={14} />
          </div>
          <span>{course.instructor}</span>
        </div>

        <div>
          <div className='cc-progress-row'>
            <span>{course.title.split(' ').slice(0, 2).join(' ')}</span>
            <span>{course.progress}%</span>
          </div>
          <div className='cc-progress-track'>
            <div
              className='cc-progress-fill'
              style={{
                width: `${course.progress}%`,
                background: isCompleted ? '#22c55e' : '#dc2626',
              }}
            />
          </div>
        </div>

        <div className='cc-footer'>
          <div className='cc-students'>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>
              {activeStudents}
            </span>{' '}
            Active Students
          </div>
          <div className='cc-actions'>
            <button
              onClick={() => navigate(`/courses/${course._id}`)}
              className='btn-resume'
              style={{ background: isCompleted ? '#16a34a' : '#dc2626' }}>
              {isCompleted ? 'Review' : 'Resume'}
            </button>
            <button className='btn-icon-outline'>
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
