import React from 'react';
import { Snowflake, Wrench, Home, Briefcase, Fan, Zap } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      id: 'residential',
      title: 'Residential Installation',
      description: 'Complete home AC solutions tailored to your floor plan. We install split systems, ducted air, and multi-head units.',
      icon: <Home className="w-8 h-8 text-blue-600" />,
      price: 'From $1,200',
    },
    {
      id: 'commercial',
      title: 'Commercial HVAC',
      description: 'Scalable climate control for offices, retail stores, and warehouses. VRF systems and rooftop package units.',
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      price: 'Custom Quote',
    },
    {
      id: 'repair',
      title: 'Repair & Diagnostics',
      description: 'Fast troubleshooting for leaking, noisy, or non-cooling units. We carry parts for major brands like Daikin, Mitsubishi, and LG.',
      icon: <Wrench className="w-8 h-8 text-blue-600" />,
      price: 'Call Out Fee: $120',
    },
    {
      id: 'maintenance',
      title: 'Regular Maintenance',
      description: 'Annual cleaning and servicing to ensure efficiency and air quality. Includes filter cleaning and gas pressure checks.',
      icon: <Snowflake className="w-8 h-8 text-blue-600" />,
      price: '$180 / unit',
    },
    {
      id: 'duct',
      title: 'Duct Cleaning',
      description: 'Remove dust, allergens, and mold from your ducted system to improve indoor air quality and system flow.',
      icon: <Fan className="w-8 h-8 text-blue-600" />,
      price: 'From $300',
    },
    {
      id: 'electrical',
      title: 'Electrical Integration',
      description: 'Seamless integration of AC units with smart home systems and existing switchboards. Safe and compliant wiring.',
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      price: 'Hourly Rates',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Our Premium Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive cooling and heating solutions designed for reliability and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group">
              <div className="p-8">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Starting At</span>
                  <span className="text-lg font-bold text-blue-600">{service.price}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 text-center">
                <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm uppercase tracking-wider">
                  Learn More &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
