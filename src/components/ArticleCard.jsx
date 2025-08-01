import React from 'react';
import Button from './Button';

const ArticleCard = ({ title, author, date, img }) => {
  return (
    <div className='card article-card'>
      {img && <img src={img} alt={title} className='course-image' />}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            marginBottom: 4,
            marginTop: 10,
            color: '#6b7280',
          }}>
          {date} · {author}
        </div>
        <h3 className='card-title'>{title}</h3>
        <div style={{ marginTop: 'auto' }}>
          <Button href='#' variant='outline'>
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
