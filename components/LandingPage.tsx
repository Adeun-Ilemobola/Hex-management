import React, { useState, useEffect } from 'react';
import { 
 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText, 
  Shield, 
  Zap, 
  
  UserCheck,
  Home,
  DollarSign,
 
  ArrowRight,
  Play,
  CheckCircle,
 
  Target,
  Briefcase,
  Sparkles
} from 'lucide-react';

const PropertyInvestmentLanding = () => {
 

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Pricing Analytics",
      description: "AI-powered algorithms analyze market data to give you the optimal price for maximum returns on your property investments.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Pooled Investment System",
      description: "Create or join investment pools with multiple investors. Leaders control distribution while investors have voting rights.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Direct Tenant Communication",
      description: "Built-in messaging system for seamless communication between property owners, agents, and tenants.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Automated Invoice Creation",
      description: "Generate professional invoices automatically for rent, maintenance, and other property-related expenses.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Investment Tracking",
      description: "Monitor your individual and pooled investments with bank-level security and real-time updates.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "All-in-One Platform",
      description: "Manage buying, selling, renting, maintenance requests, and investor relations from a single dashboard.",
      gradient: "from-yellow-500 to-amber-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Real Estate Investor",
      content: "This platform revolutionized how I manage my property portfolio. The pooled investment feature helped me access deals I couldn't afford alone.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      content: "The tenant communication system and automated invoicing saved me 15 hours per week. It's incredibly intuitive and powerful.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Investment Pool Leader",
      content: "Managing multiple investors used to be a nightmare. Now everything is transparent, automated, and professionally handled.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Add Your Property",
      description: "Input your property details and let our AI analyze market conditions for optimal pricing",
      icon: <Home className="w-10 h-10" />,
      color: "text-emerald-500"
    },
    {
      step: "02", 
      title: "Get Smart Pricing",
      description: "Receive data-driven pricing recommendations designed to maximize your return on investment",
      icon: <Target className="w-10 h-10" />,
      color: "text-blue-500"
    },
    {
      step: "03",
      title: "Choose Investment Type",
      description: "Go individual for full control or create/join investment pools for collaborative investing",
      icon: <Briefcase className="w-10 h-10" />,
      color: "text-purple-500"
    },
    {
      step: "04",
      title: "Manage & Profit",
      description: "Handle tenant communications, track returns, and scale your property investment portfolio",
      icon: <DollarSign className="w-10 h-10" />,
      color: "text-orange-500"
    }
  ];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20 mb-8 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-blue-500 dark:text-purple-400 mr-2" />
              <span className="text-blue-600 dark:text-purple-300 text-sm font-semibold">Revolutionary Property Investment Platform</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="text-gray-900 dark:text-white">Maximize Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Property Returns
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The ultimate all-in-one platform for property management, investment analytics, and collaborative investing. 
              Get optimal pricing, manage tenants, and pool investments with cutting-edge AI technology.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
                <span className="relative z-10 flex items-center">
                  Start Investing Now
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </button>
              
              <button className="group flex items-center px-10 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-purple-500 hover:text-blue-600 dark:hover:text-purple-400 transition-all duration-300 backdrop-blur-sm">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="text-5xl lg:text-6xl font-black text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">$2.5M+</div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Total Investments Managed</div>
              </div>
              <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100 dark:border-emerald-800/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="text-5xl lg:text-6xl font-black text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">1,200+</div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Active Properties</div>
              </div>
              <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-orange-800/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 hover:transform hover:-translate-y-2">
                <div className="text-5xl lg:text-6xl font-black text-orange-600 dark:text-orange-400 mb-3 group-hover:scale-110 transition-transform">98%</div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Client Satisfaction</div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="animate-features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Everything You Need
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                To Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From intelligent pricing to collaborative investing, our platform provides all the tools 
              you need to maximize your property investment returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl ${
                //   isVisible['animate-features'] ? 'animate-fade-in-up' : 'opacity-0'
                ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                // onMouseEnter={() => setHoveredFeature(index)}
                // onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="absolute inset-[1px] rounded-3xl bg-white dark:bg-gray-800"></div>
                
                <div className="relative z-10">
                  <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types Section */}
      <section id="animate-investment" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Choose Your
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Investment Style
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you're going solo or joining forces, we have the perfect investment solution for your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Individual Investment */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform translate-x-16 -translate-y-16"></div>
              
              <div className="relative p-10">
                <div className="flex items-center mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mr-6 group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">Individual Investor</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  Take full control of your property investments with advanced analytics, 
                  automated pricing, and comprehensive management tools.
                </p>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Complete ownership and control",
                    "AI-powered pricing optimization", 
                    "Direct tenant management",
                    "Automated invoicing and reporting"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/25">
                  Start Individual Investing
                </button>
              </div>
            </div>

            {/* Pooled Investment */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full transform translate-x-16 -translate-y-16"></div>
              
              <div className="relative p-10">
                <div className="flex items-center mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mr-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">Pooled Investment</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  Join or lead investment pools to access larger properties and diversify your portfolio 
                  with transparent governance and fair distribution.
                </p>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Access to premium properties",
                    "Democratic voting system",
                    "Transparent profit sharing", 
                    "Reduced individual risk"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-purple-500/25">
                  Join Investment Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="animate-steps" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              How It
              <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in minutes with our streamlined process designed for both beginners and experienced investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group text-center relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 transform translate-x-8"></div>
                )}
                
                <div className="relative mb-8">
                  <div className="mx-auto w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-blue-400 dark:group-hover:border-purple-500 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <div className={`${step.color} group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Hidden for now */}
      {/* 
      <section id="animate-testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              What Our Users
              <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of successful property investors who trust our platform.
            </p>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-12 md:p-16 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current mx-1" />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-4xl font-medium text-gray-900 dark:text-white mb-12 leading-relaxed text-center">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mr-6">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-center">
                  <div className="text-gray-900 dark:text-white font-bold text-xl">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-lg">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-12' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-4'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 md:p-20">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
              Ready to Transform Your
              <span className="block">Property Investments?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of investors who are already maximizing their returns with our intelligent platform. 
              Start your journey today with a free account.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <button className="group bg-white text-blue-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl">
                <span className="flex items-center">
                  Get Started Free
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-10 py-5 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                Schedule Demo
              </button>
            </div>
            
            <p className="text-white/80 text-lg">
               14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyInvestmentLanding;