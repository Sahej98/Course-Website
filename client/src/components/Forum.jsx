import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Search, Loader2, PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PromptModal, AlertModal, FormModal } from '../components/CustomModals';

const Forum = ({ courseId }) => {
  const { fetchThreads, fetchForumStats, createThread } = useApp();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [topTags, setTopTags] = useState([]);

  // Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const [newThreadData, setNewThreadData] = useState({
    title: '',
    content: '',
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
      console.error('Failed to load threads');
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

  const handleCreateThread = async () => {
    if (!newThreadData.title || !newThreadData.content) return;
    if (!courseId) {
      setAlertInfo({
        isOpen: true,
        title: 'Error',
        message: 'Go to a specific course to post.',
      });
      return;
    }
    try {
      await createThread(courseId, newThreadData.title, newThreadData.content, [
        'general',
      ]);
      setCreateOpen(false);
      setNewThreadData({ title: '', content: '' });
      loadThreads();
    } catch (e) {
      setAlertInfo({
        isOpen: true,
        title: 'Error',
        message: 'Failed to create thread.',
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
        title={alertInfo.title}
        message={alertInfo.message}
      />

      <FormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title='Ask a Question'
        onSubmit={handleCreateThread}>
        <div className='form-group'>
          <label className='form-label'>Question Title</label>
          <input
            className='input-field'
            required
            value={newThreadData.title}
            onChange={(e) =>
              setNewThreadData({ ...newThreadData, title: e.target.value })
            }
            placeholder='e.g., How does useEffect work?'
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Details</label>
          <textarea
            className='textarea-field'
            required
            value={newThreadData.content}
            onChange={(e) =>
              setNewThreadData({ ...newThreadData, content: e.target.value })
            }
            placeholder='Describe your question...'
          />
        </div>
        <button type='submit' className='btn btn-primary w-full'>
          Post Question
        </button>
      </FormModal>

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
            onClick={() => setCreateOpen(true)}>
            <PenSquare size={18} /> Ask a Question
          </button>
        </div>
      </div>

      <div className='forum-layout'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {threads
            .filter((t) =>
              t.title.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((thread) => (
              <div
                key={thread._id}
                onClick={() => navigate(`/forum/thread/${thread._id}`)}
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
                  <div className='vote-box'>
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
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      margin: 0,
                      color: '#1e293b',
                    }}>
                    {thread.title}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#64748b',
                      marginTop: '0.5rem',
                    }}>
                    <span style={{ fontWeight: '600' }}>
                      {thread.authorName}
                    </span>{' '}
                    •{' '}
                    <span>
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
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
            ))}
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className='card' style={{ padding: '1.25rem' }}>
            <h4 className='sidebar-title' style={{ marginBottom: '1rem' }}>
              Top Contributors
            </h4>
            {leaderboard.map((user, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
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
      </div>
    </div>
  );
};

export default Forum;
