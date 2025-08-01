import React from 'react';
import Button from './Button';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const Hero = () => {
  return (
    <section className='hero' id='hero'>
      <div className='container hero-inner'>
        <div className='hero-text'>
          <motion.h1
            className='hero-title'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Learn Tech Skills. Free or Premium.
          </motion.h1>
          <motion.p
            className='hero-sub'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}>
            Structured learning paths, vetted instructors, and real projects to
            get you job-ready.
          </motion.p>
          <div className='hero-ctas'>
            <Button href='#paths' variant='primary'>
              <Rocket size={16} /> Start Learning
            </Button>
            <Button href='#pricing' variant='outline'>
              See Plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
