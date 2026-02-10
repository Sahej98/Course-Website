import React, { useState, useEffect, useRef } from 'react';
import { Maximize, AlertTriangle, Clock } from 'lucide-react';
import { AlertModal } from './CustomModals';

const ActiveAssignment = ({ assignment, onSubmit, onCancel }) => {
  const [content, setContent] = useState(''); // Legacy/General Content
  const [answers, setAnswers] = useState({}); // Structured Answers { questionId: value }
  const [timeLeft, setTimeLeft] = useState(
    assignment.timeLimit ? assignment.timeLimit * 60 : null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onClose: () => {},
  });

  // Initialize answers
  useEffect(() => {
    if (assignment.questions) {
      const init = {};
      assignment.questions.forEach((q) => {
        init[q._id || q.id] = '';
      });
      setAnswers(init);
    }
  }, [assignment]);

  useEffect(() => {
    if (timeLeft !== null) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (assignment.antiCheat) {
      const handleChange = () => {
        if (!document.fullscreenElement) {
          setAlertInfo({
            isOpen: true,
            title: 'Violation',
            message:
              'You exited fullscreen mode! Your assignment is being submitted automatically.',
            type: 'warning',
            onClose: () => handleSubmit(true),
          });
        } else {
          setIsFullscreen(true);
        }
      };
      document.addEventListener('fullscreenchange', handleChange);
      return () =>
        document.removeEventListener('fullscreenchange', handleChange);
    }
  }, [assignment.antiCheat]);

  const enterFullscreen = () => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        setAlertInfo({
          isOpen: true,
          title: 'Error',
          message:
            'Could not enable fullscreen. Please check your browser settings.',
          type: 'error',
        });
      });
    }
  };

  const handleSubmit = (force = false) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((e) => {});
    }
    // Convert answers obj to array
    const answersArray = Object.keys(answers).map((k) => ({
      questionId: k,
      answer: answers[k],
    }));
    onSubmit({ content, answers: answersArray }, force);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (assignment.antiCheat && !isFullscreen) {
    return (
      <div className='modal-overlay'>
        <AlertModal
          isOpen={alertInfo.isOpen}
          onClose={() => {
            setAlertInfo({ ...alertInfo, isOpen: false });
            if (alertInfo.onClose) alertInfo.onClose();
          }}
          {...alertInfo}
        />

        <div
          className='modal-content'
          style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertTriangle
            size={48}
            color='#f59e0b'
            style={{ margin: '0 auto 1rem' }}
          />
          <h2>Anti-Cheat Enabled</h2>
          <p>
            This assignment requires fullscreen mode. Exiting fullscreen will
            automatically submit your work.
          </p>
          {assignment.timeLimit > 0 && (
            <p>Time Limit: {assignment.timeLimit} minutes</p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '2rem',
            }}>
            <button className='btn btn-outline' onClick={onCancel}>
              Cancel
            </button>
            <button className='btn btn-primary' onClick={enterFullscreen}>
              Start Assignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasQuestions = assignment.questions && assignment.questions.length > 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'white',
        zIndex: 9999,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => {
          setAlertInfo({ ...alertInfo, isOpen: false });
          if (alertInfo.onClose) alertInfo.onClose();
        }}
        {...alertInfo}
      />

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '1rem',
          }}>
          <div>
            <h1 style={{ margin: 0 }}>{assignment.title}</h1>
            {assignment.timeLimit > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: timeLeft < 60 ? 'red' : '#0f172a',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  marginTop: '0.5rem',
                }}>
                <Clock size={20} /> {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <button
            className='btn btn-primary'
            onClick={() => handleSubmit(false)}>
            Submit Assignment
          </button>
        </div>

        <div
          style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}>
          <h3>Instructions</h3>
          <p>{assignment.description || 'No instructions provided.'}</p>
        </div>

        {hasQuestions ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {assignment.questions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: 'white',
                }}>
                <div
                  style={{
                    marginBottom: '1rem',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                  }}>
                  {idx + 1}. {q.questionText}{' '}
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      fontWeight: 'normal',
                    }}>
                    ({q.points} pts)
                  </span>
                </div>

                {q.type === 'mcq' ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}>
                    {q.options.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.5rem',
                          border: '1px solid #f1f5f9',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}>
                        <input
                          type='radio'
                          name={`q-${q._id || q.id}`}
                          value={opt}
                          checked={answers[q._id || q.id] === opt}
                          onChange={() =>
                            setAnswers({ ...answers, [q._id || q.id]: opt })
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className='textarea-field'
                    style={{ minHeight: '100px' }}
                    placeholder='Type your answer here...'
                    value={answers[q._id || q.id] || ''}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [q._id || q.id]: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='form-group'>
            <label className='form-label'>Your Work / Answer</label>
            <textarea
              className='textarea-field'
              style={{
                minHeight: '400px',
                fontSize: '1.1rem',
                lineHeight: '1.6',
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Type your answer here...'></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveAssignment;
