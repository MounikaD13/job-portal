import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, Building, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Software Development', jobs: 320, icon: <Briefcase /> },
    { name: 'Marketing & Sales', jobs: 150, icon: <Users /> },
    { name: 'Design & Creative', jobs: 110, icon: <ChevronRight /> },
    { name: 'Finance & Accounting', jobs: 85, icon: <Building /> },
    { name: 'Customer Support', jobs: 240, icon: <Users /> },
    { name: 'Human Resources', jobs: 60, icon: <CheckCircle2 /> },
  ];

  const steps = [
    {
      title: 'Create Account',
      description: 'Sign up as a job seeker or an employer to get started with our platform.',
      step: '01'
    },
    {
      title: 'Find or Post Jobs',
      description: 'Search through thousands of listings or post your open positions instantly.',
      step: '02'
    },
    {
      title: 'Apply or Hire',
      description: 'Apply with a single click or manage your applicants seamlessly.',
      step: '03'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-900 via-green-800/80 to-cyan-700 text-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10  flex flex-col items-center justify-center text-center">
          <span className="mb-4 inline-block py-1 px-3 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-sm font-medium tracking-wide shadow-sm">
            Over 10,000+ jobs available right now
          </span>
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight mb-1 leading-tight">
            Find Your Dream Job <br className="hidden md:block" />
            {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200"> */}
            <span>
              Build Your Career
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-blue-100 max-w-3xl mb-10 font-light">
            Connect with top employers and discover opportunities that match your skills, passion, and goals.
          </p>
        </div>
      </section>

      {/*<div className="bg-gradient-to-r from-cyan-700 to-cyan-600 p-3 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-5"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white opacity-5"></div>
        <div className="relative flex flex-col items-center justify-center text-center">
          <span className="mb-4 inline-block py-1 px-3 rounded-full bg-emerald-700/90 border border-blue-400/30 text-blue-100 text-sm font-medium tracking-wide shadow-sm">
            Over 10,000+ jobs available right now
          </span>
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight mb-1 leading-tight">
            Find Your Dream Job <br className="hidden md:block" />
            <span>
              Build Your Career
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-blue-100 max-w-3xl mb-10 font-light">
            Connect with top employers and discover opportunities that match your skills, passion, and goals.
          </p>
        </div>
      </div> */}


      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div className="flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">10,000+</h3>
              <p className="text-gray-500 font-medium">Active Jobs</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">1,500+</h3>
              <p className="text-gray-500 font-medium">Top Companies</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">50,000+</h3>
              <p className="text-gray-500 font-medium">Candidates</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">15,000+</h3>
              <p className="text-gray-500 font-medium">Hired Safely</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Explore by Category</h2>
              <p className="text-gray-600 max-w-2xl text-md">Find the specific role you are looking for in our specialized industry categories, tailored for diverse skill sets.</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center text-blue-800 font-semibold hover:text-blue-600 transition-colors">
              All Categories <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0">
                  {React.cloneElement(cat.icon, { className: "h-6 w-6" })}
                </div>
                <div className="ml-5">
                  <h3 className="text-md font-bold mb-1 text-cyan-700 transition-colors">{cat.name}</h3>
                  <p className="text-gray-500 font-medium">{cat.jobs} open positions</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:hidden flex justify-center">
            <Link to="/jobs" className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-blue-50 px-6 py-3 rounded-xl w-full justify-center">
              All Categories <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-xl xl:text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">Your journey to a better career or the perfect candidate is just three simple steps away.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-100 -z-10"></div>

            {steps.map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="bg-white p-2 rounded-full mb-6 relative">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 border-4 border-white shadow-lg flex items-center justify-center text-cyan-700 text-2xl font-bold group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 max-w-sm text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-7 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-700 to-cyan-600 rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-5"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white opacity-5"></div>

            <div className="relative z-10">
              <h2 className="text-lg md:text-xl font-bold mb-2">Ready to Take the Next Step?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
                Join thousands of users who have already found their perfect match. Create your account today and start connecting.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="bg-white text-cyan-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-md">
                  Get Started Now
                </Link>
                <Link to="/jobs" className="bg-transparent border border-white/30 text-white font-bold py-4 px-10 rounded-xl hover:bg-white/10 transition-colors duration-200 text-md">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-gray-400 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-1 border-b border-gray-800 ">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4 tracking-tight">Skill Scout<span className="text-blue-500">.</span></h3>
            <p className="max-w-sm text-gray-400">
              Connecting talented professionals with the world's most innovative companies. Your dream career starts here.
            </p>
          </div>
          <div className='hidden md:block'>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Candidates</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div className='hidden md:block'>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Employers</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()}Skill Scout. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

