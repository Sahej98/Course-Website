import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  CheckCircle,
  Reply,
  User,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchThreadById, replyThread, currentUser } = useApp();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchThreadById(id);
        setThread(data);
      } catch (error) {
        console.error('Failed to load thread');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setIsReplying(true);
    try {
      const updatedThread = await replyThread(id, replyContent);
      setThread(updatedThread);
      setReplyContent('');
    } catch (error) {
      alert('Failed to post reply');
    } finally {
      setIsReplying(false);
    }
  };

  if (loading)
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!thread) return <div>Thread not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='animate-fade-in'
      style={{ paddingBottom: '2rem' }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#64748b',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
        }}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/courses/${thread.courseId}`)}>
          Back to Course
        </span>
        <span>›</span>
        <span style={{ color: '#0f172a', fontWeight: '600' }}>
          {thread.title}
        </span>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: 0,
          }}>
          {thread.title}
        </h1>
      </div>

      <div className='forum-layout'>
        {/* Main Content */}
        <div>
          {/* Question Card */}
          <div className='question-card'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.authorName}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#e2e8f0',
                  }}
                  alt=''
                />
                <div>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>
                    {thread.authorName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {thread.comments?.length || 0} Replies
                </div>
                {thread.isResolved && (
                  <span
                    style={{
                      background: '#fef3c7',
                      color: '#d97706',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}>
                    Resolved
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                color: '#334155',
                lineHeight: '1.6',
                marginBottom: '1rem',
                whiteSpace: 'pre-wrap',
              }}>
              {thread.content}
            </div>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}>
                {thread.tags.map((tag, i) => (
                  <span key={i} className='tag-pill blue'>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#f1f5f9',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                  }}>
                  <ThumbsUp size={16} color='#15803d' />
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>
                    {thread.upvotes || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          {thread.comments &&
            thread.comments.map((comment, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <div className='answer-card'>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                      }}
                      alt=''
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>
                        {comment.authorName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      style={{
                        color: '#334155',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                      }}>
                      {comment.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Reply Editor */}
          <div className='card' style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Your Answer</h3>
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
              <textarea
                style={{
                  width: '100%',
                  height: '120px',
                  border: 'none',
                  padding: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
                placeholder='Type your answer here...'
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}></textarea>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                className='btn btn-primary'
                style={{ background: '#3b82f6' }}
                onClick={handleReply}
                disabled={isReplying}>
                {isReplying ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className='card'>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              Instructor
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dbeafe',
                  margin: '0 auto 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <User size={32} color='#1d4ed8' />
              </div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                Instructor
              </div>
              <button
                className='btn w-full'
                style={{
                  marginTop: '1rem',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                }}>
                Message Instructor
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadDetail;
