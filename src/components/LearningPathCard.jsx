import Button from './Button';
import { ArrowRight, Map } from 'lucide-react';

const LearningPathCard = ({ title, desc, tag }) => {
  return (
    <div className='card learning-path-card'>
      <header className='card-header'>
        <div
          className='path-title'
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Map size={24} className='path-icon' />
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <span className='badge'>{tag}</span>
      </header>
      <p>{desc}</p>
      <div style={{ marginTop: 'auto' }}>
        <Button href='#' variant='secondary'>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}>
            <span>View Path</span>
            <ArrowRight size={16} />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default LearningPathCard;
