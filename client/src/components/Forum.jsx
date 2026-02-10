import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Search, Loader2, PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormModal, AlertModal } from './CustomModals';

const Forum = ({ courseId }) => {
  const { fetchThreads, fetchForumStats, createThread, currentUser } = useApp();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const [leaderboard, setLeaderboard] = useState([]);
  const [topTags, setTopTags] = useState([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  useEffect(() => {
    loadThreads();
    loadStats();
  }, [courseId]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const data = await fetchThreads(courseId || 'all');
      setThreads(data);
    } catch (error) {
      console.error('Failed to load threads', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { leaderboard, tags } = await fetchForumStats();
      setLeaderboard(leaderboard);
      setTopTags(tags);
    } catch (e) {
      console.error('Failed to load forum stats');
    }
  };

  const handleThreadClick = (threadId) => {
    navigate(`/forum/thread/${threadId}`);
  };

  const handleCreateThread = async () => {
    if (!newThread.title || !newThread.content) return;

    try {
      if (!courseId) {
        setAlertInfo({
          isOpen: true,
          title: 'Action Required',
          message: 'Please go to a specific course to ask a question.',
          type: 'warning',
        });
        return;
      }
      await createThread(courseId, newThread.title, newThread.content, [
        'general',
      ]);
      setNewThread({ title: '', content: '' });
      setIsModalOpen(false);
      loadThreads();
    } catch (e) {
      setAlertInfo({
        isOpen: true,
        title: 'Error',
        message: 'Failed to create thread',
        type: 'error',
      });
    }
  };

  if (isLoading)
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='animate-spin text-primary' />
      </div>
    );

  return (
    <div>
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
        {...alertInfo}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Ask a Question'
        onSubmit={handleCreateThread}>
        <div className='form-group'>
          <label className='form-label'>Title</label>
          <input
            className='input-field'
            value={newThread.title}
            onChange={(e) =>
              setNewThread({ ...newThread, title: e.target.value })
            }
            required
            placeholder="What's your question?"
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Details</label>
          <textarea
            className='textarea-field'
            value={newThread.content}
            onChange={(e) =>
              setNewThread({ ...newThread, content: e.target.value })
            }
            required
            placeholder='Provide more context...'
          />
        </div>
        <button className='btn btn-primary w-full'>Post Question</button>
      </FormModal>

      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '0.25rem',
          }}>
          Discussion Forum
        </h2>
        <p style={{ color: '#64748b' }}>
          Ask your questions and help your peers by sharing knowledge.
        </p>
      </div>

      {/* Toolbar */}
      <div className='courses-toolbar'>
        <div className='search-wrapper'>
          <Search className='search-icon' size={20} />
          <input
            className='search-input'
            placeholder='Search for questions...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='filter-group'>
          <button
            className='btn btn-primary'
            style={{ background: '#f97316' }}
            onClick={() => setIsModalOpen(true)}>
            <PenSquare size={18} /> Ask a Question
          </button>
        </div>
      </div>

      {/* Popular Tags Row (Real) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
        <span style={{ fontWeight: '700', color: '#0f172a' }}>
          Popular Tags:
        </span>
        {topTags.map((tag, i) => (
          <span
            key={i}
            style={{
              background: i === 0 ? '#e2e8f0' : '#f1f5f9',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.85rem',
              color: '#475569',
              cursor: 'pointer',
            }}>
            {tag._id} ({tag.count})
          </span>
        ))}
      </div>

      {/* Layout */}
      <div className='forum-layout'>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {threads.length > 0 ? (
            threads
              .filter((t) =>
                t.title.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((thread) => (
                <div
                  key={thread._id}
                  onClick={() => handleThreadClick(thread._id)}
                  className='forum-thread-card'
                  style={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                    <div
                      className='vote-box'
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: '#f1f5f9',
                        border: 'none',
                      }}>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: '800',
                          color: '#0f172a',
                        }}>
                        {thread.upvotes}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          color: '#64748b',
                        }}>
                        votes
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
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
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '0.5rem',
                      }}>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          margin: 0,
                          color: '#1e293b',
                        }}>
                        {thread.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {thread.tags &&
                          thread.tags.map((tag, i) => (
                            <span
                              key={i}
                              className='tag-pill blue'
                              style={{
                                background: '#eff6ff',
                                color: '#2563eb',
                              }}>
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#64748b',
                      }}>
                      <span style={{ fontWeight: '600', color: '#334155' }}>
                        {thread.authorName}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      minWidth: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.5rem',
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#475569',
                      }}>
                      <MessageSquare size={16} fill='#94a3b8' />{' '}
                      {thread.comments?.length || 0} Replies
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#94a3b8',
              }}>
              No discussions yet.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Leaderboard */}
          <div className='card' style={{ padding: '1.25rem' }}>
            <h4 className='sidebar-title' style={{ marginBottom: '1rem' }}>
              Top Contributors
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
              {leaderboard.map((user, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                      }}
                      alt=''
                    />
                    <span>{user._id}</span>
                  </div>
                  <span style={{ fontWeight: '700' }}>{user.count} Posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Tags Used */}
          <div className='card' style={{ padding: '1.25rem' }}>
            <h4 className='sidebar-title' style={{ marginBottom: '1rem' }}>
              Top Tags Used
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}>
              {topTags.map((tag, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#1e3a8a', fontWeight: '600' }}>
                    ● {tag._id}
                  </span>
                  <span style={{ color: '#64748b' }}>{tag.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
