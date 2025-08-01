import React from 'react';
import Button from './Button';
import { Clock, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseCard = ({ title, type, description, duration, img }) => {
  return (
    <motion.div
      className='card course-card'
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}>
      {img && (
        <img src={img} alt={title} style={{marginBottom: 10}} className='course-image' loading='lazy' />
      )}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <h3 className='card-title'>{title}</h3>
          <p className='card-text'>{description}</p>
        </div>
        <div>
          <span
            className={`badge ${
              type === 'Free' ? 'badge-free' : 'badge-paid'
            }`}>
            {type}
          </span>
        </div>
      </div>
      <div
        className='course-footer'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.85rem',
          }}>
          <Clock size={16} />
          <span>{duration}</span>
        </div>
        <Button variant='primary' href='#'>
          <Play size={16} /> Start
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
