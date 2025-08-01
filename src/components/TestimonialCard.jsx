import React from 'react';

const TestimonialCard = ({ name, quote, role, avatar }) => {
  return (
    <div className='card testimonial-card'>
      <div className='testimonial-content'>
        <img src={avatar} alt={name} className='testimonial-avatar' />
        <div>
          <p className='testimonial-quote'>"{quote}"</p>
          <footer className='testimonial-author'>
            — {name}, {role}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
