import React from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

const ModalBase = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '450px',
}) => {
  if (!isOpen) return null;
  return (
    <div className='modal-overlay animate-fade-in' style={{ zIndex: 9999 }}>
      <div className='modal-content' style={{ maxWidth }}>
        <div className='modal-header'>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color='#64748b' />
          </button>
        </div>
        <div className='modal-body'>{children}</div>
      </div>
    </div>
  );
};

export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  type = 'info',
}) => {
  const Icon =
    type === 'success'
      ? CheckCircle
      : type === 'error'
        ? AlertCircle
        : HelpCircle;
  const color =
    type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb';

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div
          style={{
            margin: '0 auto 1rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}>
          <Icon size={32} />
        </div>
        <p style={{ color: '#334155', fontSize: '1rem' }}>{message}</p>
        <button
          className='btn btn-primary w-full'
          style={{ marginTop: '1.5rem' }}
          onClick={onClose}>
          Okay
        </button>
      </div>
    </ModalBase>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
}) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <p
          style={{
            color: '#334155',
            fontSize: '1rem',
            marginBottom: '1.5rem',
          }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className='btn btn-outline w-full' onClick={onClose}>
            Cancel
          </button>
          <button
            className='btn btn-primary w-full'
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ background: '#dc2626' }}>
            Confirm
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export const PromptModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
  initialValue = '',
}) => {
  const [value, setValue] = React.useState(initialValue);

  // Reset value when opening
  React.useEffect(() => {
    if (isOpen) setValue(initialValue);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          {label && <label className='form-label'>{label}</label>}
          <textarea
            className='textarea-field'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            required
            style={{ minHeight: '100px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type='button'
            className='btn btn-outline w-full'
            onClick={onClose}>
            Cancel
          </button>
          <button type='submit' className='btn btn-primary w-full'>
            Submit
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export const FormModal = ({ isOpen, onClose, onSubmit, title, children }) => (
  <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}>
      {children}
    </form>
  </ModalBase>
);
