import React from 'react';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import Pricing from '../components/Pricing';
import NewsSection from '../components/NewsSection';
import ContactForm from '../components/ContactForm';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="space-y-12 pb-20">
        <ServicesGrid />
        <Pricing />
        <NewsSection />
        <ContactForm />
      </div>
    </>
  );
};

export default Home;