import React from 'react';
import Button from './Button';

const PlanCard = ({ name, price, features, highlight }) => {
  return (
    <div className={`plan-card ${highlight ? 'featured' : ''}`}>
      {highlight && <div className='plan-badge'>Most Popular</div>}
      <div>
        <h3 className='plan-title'>{name}</h3>
        <p className='plan-price'>{price}</p>
        <ul className='plan-features'>
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>
      <Button variant={highlight ? 'primary' : 'outline'} href='#'>
        {highlight ? 'Go Pro' : 'Get Started'}
      </Button>
    </div>
  );
};

export default PlanCard;
