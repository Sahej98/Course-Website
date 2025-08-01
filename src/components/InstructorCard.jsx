import React from 'react';
import Button from './Button';

const InstructorCard = ({ name, role, avatar, bio }) => {
  return (
    <div className='card instructor-card'>
      <img src={avatar} alt={name} className='instructor-avatar' />
      <h3 className='card-title'>{name}</h3>
      <div style={{ fontSize: '0.85rem', color: '#1d1160', marginBottom: 6 }}>
        {role}
      </div>
      <p className='card-text'>{bio}</p>
      <Button href='#' variant='outline'>
        View Profile
      </Button>
    </div>
  );
};

export default InstructorCard;
