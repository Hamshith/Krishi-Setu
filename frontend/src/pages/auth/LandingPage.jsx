import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Store, Users, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-earth-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
            <Sprout size={28} />
          </div>
          <span className="text-2xl font-display font-bold text-dark-900 tracking-tight">Krishi<span className="text-primary-600">Setu</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden bg-hero-gradient text-white">
          <div className="absolute inset-0 bg-green-glow animate-pulse-slow"></div>
          
          <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/50 border border-primary-500/30 text-primary-300 text-sm font-medium mb-6">
                <Leaf size={16} /> Empowering Agriculture Ecosystems
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 text-white">
                Bridge the Gap in <br/>
                <span className="text-primary-400">Modern Agriculture</span>
              </h1>
              <p className="text-lg text-earth-200 mb-8 max-w-xl leading-relaxed">
                Connect directly with farmers, authentic verified vendors, and open markets. KrishiSetu is the ultimate platform uniting the entire agricultural community.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-400 transition-colors shadow-glow-green flex items-center gap-2">
                  Join the Network <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Feature Cards Grid in Hero */}
            <div className="grid grid-cols-2 gap-4 lg:ml-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 card-gradient mt-8 animate-float">
                <div className="bg-primary-500/20 text-primary-300 p-3 rounded-xl w-fit mb-4">
                  <Sprout size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">For Farmers</h3>
                <p className="text-sm text-earth-200">Manage crops, buy genuine inputs, and sell produce directly.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 card-gradient mb-8 animate-float" style={{animationDelay: '1s'}}>
                <div className="bg-earth-500/20 text-earth-300 p-3 rounded-xl w-fit mb-4">
                  <Store size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">For Vendors</h3>
                <p className="text-sm text-earth-200">Expand your reach. Sell quality agri-inputs directly to farmers.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 card-gradient col-span-2 mx-8 animate-float" style={{animationDelay: '2s'}}>
                <div className="bg-blue-500/20 text-blue-300 p-3 rounded-xl w-fit mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">For Retail Users</h3>
                <p className="text-sm text-earth-200">Purchase fresh, high-quality farm produce straight from the source.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-24 bg-white px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">Why Choose KrishiSetu?</h2>
            <p className="text-dark-600 max-w-2xl mx-auto mb-16">Designed specifically for the agricultural sector, focused on increasing transparency, profitability, and ease of doing business.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Direct Market Access', desc: 'Eliminate middlemen and get the best prices for your produce or products.' },
                { title: 'Verified Participants', desc: 'Trade safely in a secure ecosystem protected by role-based intelligent access.', icon: <ShieldCheck className="mx-auto text-primary-500 mb-4" size={40} /> },
                { title: 'Real-time Tracking', desc: 'Track your orders, stock, and earnings with highly intuitive dashboards.' }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-earth-50 border border-earth-100 hover:shadow-card transition-shadow">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-dark-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dark-900 text-earth-200 py-8 text-center px-6">
        <p>© {new Date().getFullYear()} KrishiSetu. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
