import React from 'react';
import Button from './Button';

const Newsletter = () => {
  return (
    <section className='newsletter-section'>
      <div className='container newsletter-inner'>
        <div className='newsletter-text'>
          <h2 className='section-title'>Never Miss an Update</h2>
          <p className='section-subtitle'>
            New course drops, exclusive workshops, and special offers.
          </p>
        </div>
        <form className='newsletter-form' onSubmit={(e) => e.preventDefault()}>
          <input
            type='email'
            placeholder='you@example.com'
            aria-label='email'
            required
          />
          <Button variant='primary' type='submit'>
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
