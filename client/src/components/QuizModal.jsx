import React, { useState } from 'react';
import { X, CheckCircle, Award, ArrowRight } from 'lucide-react';

const QuizModal = ({ quiz, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const pointsPerQuestion = quiz.totalPoints / quiz.questions.length;

    if (isCorrect) {
      setScore((prev) => prev + pointsPerQuestion);
    }

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selected: selectedOption,
        correct: currentQuestion.correctOptionIndex,
        isCorrect,
      },
    ]);

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  if (showResult) {
    const percentage = (score / quiz.totalPoints) * 100;

    return (
      <div className='modal-overlay animate-fade-in'>
        <div className='modal-content' style={{ maxWidth: '450px' }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: '#e0e7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: '#4f46e5',
              }}>
              <Award size={40} />
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}>
              Quiz Completed!
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              You scored{' '}
              <span style={{ fontWeight: '700', color: '#4f46e5' }}>
                {Math.round(score)}
              </span>{' '}
              out of {quiz.totalPoints}
            </p>

            <div
              style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid #f1f5f9',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#475569',
                  }}>
                  Accuracy
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>
                  {Math.round(percentage)}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  background: '#e2e8f0',
                  height: '8px',
                  borderRadius: '99px',
                  overflow: 'hidden',
                }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: percentage >= 70 ? '#22c55e' : '#f97316',
                    borderRadius: '99px',
                    transition: 'width 1s ease-out',
                  }}></div>
              </div>
            </div>

            <button
              onClick={onClose}
              className='btn'
              style={{
                width: '100%',
                background: '#0f172a',
                color: 'white',
                justifyContent: 'center',
              }}>
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='modal-overlay animate-fade-in'>
      <div className='modal-content'>
        {/* Header */}
        <div className='modal-header'>
          <div>
            <h3 style={{ fontWeight: '700', margin: 0 }}>{quiz.title}</h3>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                margin: '0.25rem 0 0 0',
              }}>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className='modal-body'>
          <h4
            style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}>
            {currentQuestion.questionText}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`option-btn ${selectedOption === idx ? 'selected' : ''}`}>
                <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  {option}
                </span>
                {selectedOption === idx && (
                  <CheckCircle size={18} style={{ color: '#4f46e5' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='modal-footer'>
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className='btn btn-primary'
            style={{
              width: '100%',
              justifyContent: 'center',
              opacity: selectedOption === null ? 0.5 : 1,
              cursor: selectedOption === null ? 'not-allowed' : 'pointer',
            }}>
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            {!isLastQuestion && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
