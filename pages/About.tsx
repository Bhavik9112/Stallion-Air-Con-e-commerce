import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About Stallion Air Con</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Dedicated to bringing superior climate control to homes and businesses since 2010.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://picsum.photos/600/800" 
              alt="Our Team" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Stallion Air Con was founded on a simple principle: honest work at a fair price. Starting as a single-van operation, we have grown into one of the region's most trusted HVAC providers.
            </p>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Our team consists of certified engineers who are passionate about energy efficiency. We believe that a well-installed air conditioning system not only provides comfort but also reduces environmental impact through efficient energy usage.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h4 className="text-4xl font-bold text-blue-600 mb-2">15+</h4>
                <p className="text-slate-600 font-medium">Years Experience</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h4 className="text-4xl font-bold text-blue-600 mb-2">5k+</h4>
                <p className="text-slate-600 font-medium">Installs Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
