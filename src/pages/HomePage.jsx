import React from 'react';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import InstructorCard from '../components/InstructorCard';
import PlanCard from '../components/PlanCard';
import Newsletter from '../components/Newsletter';
import PartnerLogo from '../components/PartnerLogo';
import WhyChooseUsCard from '../components/WhyChooseUsCard';
import ArticleCard from '../components/ArticleCard';
import TestimonialCard from '../components/TestimonialCard';
import FAQItem from '../components/FAQItem';

import {
  learningPaths,
  featuredCourses,
  instructors,
  testimonials,
  articles,
  plans,
  partners,
  whyChooseUs,
  faqs,
} from '../data';

const HomePage = () => {
  return (
    <>
      <Hero />

      {/* Why Choose Us */}
      <section className='section' id='why-us'>
        <div className='container'>
          <h2 className='section-title'>Why Choose LearnHub?</h2>
          <p className='section-subtitle'>Here's why learners trust us.</p>
          <div className='grid-4'>
            {whyChooseUs.map((reason) => (
              <WhyChooseUsCard key={reason.id} {...reason} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Preview */}
      <section className='section' id='paths'>
        <div className='container'>
          <h2 className='section-title'>Learning Paths</h2>
          <p className='section-subtitle'>Goal-oriented roadmaps to mastery.</p>
          <div className='grid-3'>
            {learningPaths.slice(0, 3).map((p) => (
              <div key={p.id} className='card'>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 className='card-title'>{p.title}</h3>
                    <p className='card-text'>{p.desc}</p>
                  </div>
                  <div>
                    <span className='badge tag'>{p.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href='/learning-paths' className='button button-outline'>
              View All Paths
            </a>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className='section' id='courses'>
        <div className='container'>
          <h2 className='section-title'>Featured Courses</h2>
          <p className='section-subtitle'>Start with top-rated content.</p>
          <div className='grid-4'>
            {featuredCourses.slice(0, 4).map((c) => (
              <CourseCard key={c.id} {...c} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href='/courses' className='button button-outline'>
              View All Courses
            </a>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className='section' id='instructors'>
        <div className='container'>
          <h2 className='section-title'>Top Instructors</h2>
          <p className='section-subtitle'>Skilled mentors you'll learn from.</p>
          <div className='grid-3'>
            {instructors.slice(0, 3).map((inst) => (
              <InstructorCard key={inst.id} {...inst} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href='/instructors' className='button button-outline'>
              Meet All Instructors
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='section' id='testimonials'>
        <div className='container'>
          <h2 className='section-title'>Success Stories</h2>
          <p className='section-subtitle'>
            See what our learners have achieved
          </p>
          <div className='grid-3'>
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href='/testimonials' className='button button-outline'>
              View All Testimonials
            </a>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className='section' id='articles'>
        <div className='container'>
          <h2 className='section-title'>Latest Articles</h2>
          <p className='section-subtitle'>
            Insights, guides, and news from the tech world.
          </p>
          <div className='grid-3'>
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href='/blog' className='button button-outline'>
              View All Articles
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className='section' id='pricing'>
        <div className='container'>
          <h2 className='section-title'>Pricing Plans</h2>
          <p className='section-subtitle'>
            Flexible, transparent, job-focused.
          </p>
          <div className='grid-4'>
            {plans.map((plan) => (
              <PlanCard key={plan.id} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className='section' id='partners'>
        <div className='container'>
          <h2 className='section-title'>Trusted By</h2>
          <p className='section-subtitle'>
            Partnered with leading brands and universities.
          </p>
          <div
            className='grid-4'
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            {partners.map((partner, i) => (
              <PartnerLogo
                key={partner.id}
                logo={partner.logo}
                name={partner.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='section' id='faq'>
        <div className='container'>
          <h2 className='section-title'>Frequently Asked Questions</h2>
          <p className='section-subtitle'>
            Still have questions? We’ve got answers.
          </p>
          <div className='faq-list'>
            {faqs.map((item, index) => (
              <FAQItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default HomePage;
