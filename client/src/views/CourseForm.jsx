import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Loader2,
  Plus,
  Trash,
  ArrowLeft,
  Upload,
  HelpCircle,
  List,
} from 'lucide-react';
import { AlertModal } from '../components/CustomModals';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCourseById, createCourse, updateCourse, uploadFile } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    modules: [],
    assignments: [],
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onClose: () => {},
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCourseById(id)
        .then((data) => {
          setFormData(data);
          setLoading(false);
        })
        .catch(() => {
          setAlertInfo({
            isOpen: true,
            title: 'Error',
            message: 'Failed to load course details.',
            type: 'error',
            onClose: () => navigate('/courses'),
          });
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateCourse(id, formData);
      } else {
        await createCourse(formData);
      }
      navigate('/courses');
    } catch (error) {
      setAlertInfo({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save course.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      setFormData({ ...formData, thumbnail: res.url });
    } catch (e) {
      setAlertInfo({
        isOpen: true,
        title: 'Upload Failed',
        message: 'Thumbnail upload failed.',
        type: 'error',
      });
    }
  };

  const handleFileUpload = async (e, moduleIndex, resourceIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadProgress(10);
      const res = await uploadFile(file, (percent) =>
        setUploadProgress(percent),
      );
      const newModules = [...formData.modules];
      newModules[moduleIndex].resources[resourceIndex].url = res.url;
      newModules[moduleIndex].resources[resourceIndex].title = file.name;
      setFormData({ ...formData, modules: newModules });
    } catch (err) {
      setAlertInfo({
        isOpen: true,
        title: 'Upload Failed',
        message: 'Could not upload file.',
        type: 'error',
      });
    } finally {
      setUploadProgress(0);
    }
  };

  // Module Logic
  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { id: Date.now().toString(), title: 'New Module', resources: [] },
      ],
    });
  };

  const updateModule = (index, field, value) => {
    const newModules = [...formData.modules];
    newModules[index][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const deleteModule = (index) => {
    const newModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: newModules });
  };

  // Resource Logic
  const addResource = (moduleIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].resources.push({
      title: 'New Resource',
      type: 'link',
      url: '',
    });
    setFormData({ ...formData, modules: newModules });
  };

  const updateResource = (moduleIndex, resourceIndex, field, value) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].resources[resourceIndex][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const deleteResource = (moduleIndex, resourceIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].resources = newModules[
      moduleIndex
    ].resources.filter((_, i) => i !== resourceIndex);
    setFormData({ ...formData, modules: newModules });
  };

  // Assignment Logic
  const addAssignment = () => {
    setFormData({
      ...formData,
      assignments: [
        ...formData.assignments,
        {
          id: Date.now().toString(),
          title: 'New Assignment',
          description: '',
          dueDate: new Date().toISOString().split('T')[0],
          totalPoints: 100,
          antiCheat: false,
          timeLimit: 0,
          questions: [],
        },
      ],
    });
  };

  const updateAssignment = (index, field, value) => {
    const newAssign = [...formData.assignments];
    newAssign[index][field] = value;
    setFormData({ ...formData, assignments: newAssign });
  };

  const deleteAssignment = (index) => {
    const newAssign = formData.assignments.filter((_, i) => i !== index);
    setFormData({ ...formData, assignments: newAssign });
  };

  // Questions Logic
  const addQuestion = (assignIndex, type) => {
    const newAssign = [...formData.assignments];
    newAssign[assignIndex].questions.push({
      id: Date.now().toString(),
      type,
      questionText: '',
      options: type === 'mcq' ? ['Option 1', 'Option 2'] : [],
      points: 10,
    });
    setFormData({ ...formData, assignments: newAssign });
  };

  const updateQuestion = (assignIndex, qIndex, field, value) => {
    const newAssign = [...formData.assignments];
    newAssign[assignIndex].questions[qIndex][field] = value;
    setFormData({ ...formData, assignments: newAssign });
  };

  const updateOption = (assignIndex, qIndex, oIndex, value) => {
    const newAssign = [...formData.assignments];
    newAssign[assignIndex].questions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, assignments: newAssign });
  };

  const addOption = (assignIndex, qIndex) => {
    const newAssign = [...formData.assignments];
    newAssign[assignIndex].questions[qIndex].options.push('New Option');
    setFormData({ ...formData, assignments: newAssign });
  };

  const deleteQuestion = (assignIndex, qIndex) => {
    const newAssign = [...formData.assignments];
    newAssign[assignIndex].questions = newAssign[assignIndex].questions.filter(
      (_, i) => i !== qIndex,
    );
    setFormData({ ...formData, assignments: newAssign });
  };

  return (
    <div className='animate-fade-in' style={{ paddingBottom: '3rem' }}>
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => {
          setAlertInfo({ ...alertInfo, isOpen: false });
          if (alertInfo.onClose) alertInfo.onClose();
        }}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
      />

      <button
        onClick={() => navigate('/courses')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          color: '#64748b',
        }}>
        <ArrowLeft size={18} /> Back
      </button>

      <h1
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
        }}>
        {id ? 'Edit Course' : 'Create New Course'}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className='card'>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
            Basic Details
          </h3>
          <div className='form-group'>
            <label className='form-label'>Course Title</label>
            <input
              className='input-field'
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Description</label>
            <textarea
              className='textarea-field'
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Thumbnail</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={formData.thumbnail}
                style={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
                alt=''
              />
              <label
                className='btn btn-outline btn-sm'
                style={{ cursor: 'pointer' }}>
                <Upload size={14} /> Upload Thumbnail
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={handleThumbnailUpload}
                />
              </label>
            </div>
          </div>
        </div>

        <div className='card'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
            <h3 style={{ fontWeight: 'bold', margin: 0 }}>Modules & Content</h3>
            <button
              type='button'
              onClick={addModule}
              className='btn'
              style={{
                fontSize: '0.8rem',
                background: '#eff6ff',
                color: '#1d4ed8',
              }}>
              <Plus size={14} /> Add Module
            </button>
          </div>

          {formData.modules.map((module, mIndex) => (
            <div
              key={mIndex}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                background: '#f8fafc',
              }}>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  alignItems: 'center',
                }}>
                <div
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}>
                  {mIndex + 1}
                </div>
                <input
                  className='input-field'
                  value={module.title}
                  onChange={(e) =>
                    updateModule(mIndex, 'title', e.target.value)
                  }
                  placeholder='Module Title'
                  style={{ fontWeight: '600' }}
                />
                <button
                  type='button'
                  onClick={() => deleteModule(mIndex)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '0.5rem',
                  }}>
                  <Trash size={18} />
                </button>
              </div>

              <div style={{ paddingLeft: '2.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}>
                  {module.resources.map((res, rIndex) => (
                    <div
                      key={rIndex}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 2fr 3fr auto',
                        gap: '0.75rem',
                        alignItems: 'center',
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}>
                      <select
                        className='input-field'
                        style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                        value={res.type}
                        onChange={(e) =>
                          updateResource(mIndex, rIndex, 'type', e.target.value)
                        }>
                        <option value='video'>Video</option>
                        <option value='pdf'>PDF</option>
                        <option value='ppt'>PPT</option>
                        <option value='link'>Link</option>
                      </select>
                      <input
                        className='input-field'
                        style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                        placeholder='Resource Title'
                        value={res.title}
                        onChange={(e) =>
                          updateResource(
                            mIndex,
                            rIndex,
                            'title',
                            e.target.value,
                          )
                        }
                      />

                      {res.type === 'link' || res.type === 'video' ? (
                        <input
                          className='input-field'
                          style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                          placeholder='URL'
                          value={res.url}
                          onChange={(e) =>
                            updateResource(
                              mIndex,
                              rIndex,
                              'url',
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                          }}>
                          <input
                            className='input-field'
                            disabled
                            value={res.url}
                            style={{
                              fontSize: '0.8rem',
                              background: '#f1f5f9',
                            }}
                            placeholder='File URL'
                          />
                          <label
                            className='btn btn-sm btn-outline'
                            style={{ cursor: 'pointer' }}>
                            <Upload size={12} /> Upload
                            <input
                              type='file'
                              hidden
                              onChange={(e) =>
                                handleFileUpload(e, mIndex, rIndex)
                              }
                            />
                          </label>
                        </div>
                      )}
                      <button
                        type='button'
                        onClick={() => deleteResource(mIndex, rIndex)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}>
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                  {uploadProgress > 0 && (
                    <div className='progress-track'>
                      <div
                        className='progress-fill-blue'
                        style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </div>
                <button
                  type='button'
                  onClick={() => addResource(mIndex)}
                  className='btn'
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    padding: '0.4rem 0.8rem',
                    background: 'white',
                    border: '1px dashed #cbd5e1',
                  }}>
                  <Plus size={12} /> Add Resource
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='card'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
            <h3 style={{ fontWeight: 'bold', margin: 0 }}>Assignments</h3>
            <button
              type='button'
              onClick={addAssignment}
              className='btn'
              style={{
                fontSize: '0.8rem',
                background: '#eff6ff',
                color: '#1d4ed8',
              }}>
              <Plus size={14} /> Add Assignment
            </button>
          </div>

          {formData.assignments.map((assign, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #e2e8f0',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                background: '#f8fafc',
              }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}>
                <input
                  className='input-field'
                  placeholder='Assignment Title'
                  value={assign.title}
                  onChange={(e) => updateAssignment(i, 'title', e.target.value)}
                />
                <input
                  type='date'
                  className='input-field'
                  value={assign.dueDate}
                  onChange={(e) =>
                    updateAssignment(i, 'dueDate', e.target.value)
                  }
                />
              </div>
              <div
                style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type='number'
                  className='input-field'
                  placeholder='Time Limit (mins)'
                  value={assign.timeLimit}
                  onChange={(e) =>
                    updateAssignment(i, 'timeLimit', parseInt(e.target.value))
                  }
                />
                <label
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                  <input
                    type='checkbox'
                    checked={assign.antiCheat}
                    onChange={(e) =>
                      updateAssignment(i, 'antiCheat', e.target.checked)
                    }
                  />
                  Enable Anti-Cheat
                </label>
              </div>

              {/* Question Builder */}
              <div
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                  Questions
                </h4>
                {assign.questions &&
                  assign.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      style={{
                        marginBottom: '1rem',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '1rem',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                        }}>
                        <select
                          className='input-field'
                          style={{ width: '100px' }}
                          value={q.type}
                          onChange={(e) =>
                            updateQuestion(i, qIdx, 'type', e.target.value)
                          }>
                          <option value='text'>Text</option>
                          <option value='mcq'>MCQ</option>
                        </select>
                        <input
                          className='input-field'
                          placeholder='Question Text'
                          value={q.questionText}
                          onChange={(e) =>
                            updateQuestion(
                              i,
                              qIdx,
                              'questionText',
                              e.target.value,
                            )
                          }
                          style={{ flex: 1 }}
                        />
                        <input
                          type='number'
                          className='input-field'
                          style={{ width: '80px' }}
                          placeholder='Pts'
                          value={q.points}
                          onChange={(e) =>
                            updateQuestion(i, qIdx, 'points', e.target.value)
                          }
                        />
                        <button
                          type='button'
                          onClick={() => deleteQuestion(i, qIdx)}
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#ef4444',
                          }}>
                          <Trash size={16} />
                        </button>
                      </div>
                      {q.type === 'mcq' && (
                        <div style={{ paddingLeft: '1rem' }}>
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginBottom: '0.25rem',
                              }}>
                              <div
                                style={{
                                  width: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}>
                                •
                              </div>
                              <input
                                className='input-field'
                                style={{
                                  padding: '0.25rem',
                                  fontSize: '0.85rem',
                                }}
                                value={opt}
                                onChange={(e) =>
                                  updateOption(i, qIdx, oIdx, e.target.value)
                                }
                              />
                            </div>
                          ))}
                          <button
                            type='button'
                            onClick={() => addOption(i, qIdx)}
                            className='btn btn-sm btn-outline'
                            style={{ marginTop: '0.5rem' }}>
                            Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type='button'
                    onClick={() => addQuestion(i, 'text')}
                    className='btn btn-sm'
                    style={{ background: '#f1f5f9' }}>
                    <Plus size={12} /> Add Written Q
                  </button>
                  <button
                    type='button'
                    onClick={() => addQuestion(i, 'mcq')}
                    className='btn btn-sm'
                    style={{ background: '#f1f5f9' }}>
                    <List size={12} /> Add MCQ
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type='button'
                  onClick={() => deleteAssignment(i)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                  <Trash size={16} /> Delete Assignment
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='btn btn-primary'
          style={{ alignSelf: 'flex-start', padding: '1rem 3rem' }}>
          {loading ? <Loader2 className='animate-spin' /> : 'Save Course'}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
