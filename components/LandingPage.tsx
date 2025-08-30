import React from 'react';
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
      gradient: "from-pink-500 to-fuchsia-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Pooled Investment System",
      description: "Create or join investment pools with multiple investors. Leaders control distribution while investors have voting rights.",
      gradient: "from-sky-500 to-purple-500"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Direct Tenant Communication",
      description: "Built-in messaging system for seamless communication between property owners, agents, and tenants.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Automated Invoice Creation",
      description: "Generate professional invoices automatically for rent, maintenance, and other property-related expenses.",
      gradient: "from-fuchsia-500 to-sky-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Investment Tracking",
      description: "Monitor your individual and pooled investments with bank-level security and real-time updates.",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "All-in-One Platform",
      description: "Manage buying, selling, renting, maintenance requests, and investor relations from a single dashboard.",
      gradient: "from-sky-500 to-fuchsia-500"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Add Your Property",
      description: "Input your property details and let our AI analyze market conditions for optimal pricing",
      icon: <Home className="w-10 h-10" />,
      color: "text-pink-500 dark:text-pink-400"
    },
    {
      step: "02",
      title: "Get Smart Pricing",
      description: "Receive data-driven pricing recommendations designed to maximize your return on investment",
      icon: <Target className="w-10 h-10" />,
      color: "text-sky-500 dark:text-sky-400"
    },
    {
      step: "03",
      title: "Choose Investment Type",
      description: "Go individual for full control or create/join investment pools for collaborative investing",
      icon: <Briefcase className="w-10 h-10" />,
      color: "text-purple-500 dark:text-purple-400"
    },
    {
      step: "04",
      title: "Manage & Profit",
      description: "Handle tenant communications, track returns, and scale your property investment portfolio",
      icon: <DollarSign className="w-10 h-10" />,
      color: "text-fuchsia-500 dark:text-fuchsia-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-sky-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Aurora Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 opacity-30 animate-pulse"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] border border-white/15 dark:border-white/5 mb-8">
              <Sparkles className="w-5 h-5 text-fuchsia-500 dark:text-fuchsia-400 mr-2" />
              <span className="text-slate-700 dark:text-white font-semibold text-sm">Revolutionary Property Investment Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="text-slate-900 dark:text-white">Maximize Your</span>
              <br />
              <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
                Property Returns
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The ultimate all-in-one platform for property management, investment analytics, and collaborative investing.
              Get optimal pricing, manage tenants, and pool investments with cutting-edge AI technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button className="group relative bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.01] hover:brightness-110 active:brightness-95 shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                <span className="relative z-10 flex items-center">
                  Start Investing Now
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white">
              Everything You Need
              <span className="block bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
                To Succeed
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From intelligent pricing to collaborative investing, our platform provides all the tools
              you need to maximize your property investment returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] shadow-xl border border-white/15 dark:border-white/5 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white">
              Choose Your
              <span className="block bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                Investment Style
              </span>
            </h2>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Whether you're going solo or joining forces, we have the perfect investment solution for your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Individual Investment */}
            <div className="group relative overflow-hidden rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] shadow-xl border border-white/15 dark:border-white/5 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative p-10">
                <div className="flex items-center mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-purple-500 mr-6 group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Individual Investor</h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
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
                    <li key={idx} className="flex items-center text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-6 h-6 text-fuchsia-500 mr-4 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] hover:brightness-110 active:brightness-95 shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                  Start Individual Investing
                </button>
              </div>
            </div>

            {/* Pooled Investment */}
            <div className="group relative overflow-hidden rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] shadow-xl border border-white/15 dark:border-white/5 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative p-10">
                <div className="flex items-center mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mr-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Pooled Investment</h3>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
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
                    <li key={idx} className="flex items-center text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-6 h-6 text-fuchsia-500 mr-4 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] hover:brightness-110 active:brightness-95 shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:focus-visible:ring-fuchsia-400/40">
                  Join Investment Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white">
              How It
              <span className="block bg-gradient-to-r from-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get started in minutes with our streamlined process designed for both beginners and experienced investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group text-center relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 transform translate-x-8"></div>
                )}

                <div className="relative mb-8">
                  <div className="mx-auto w-24 h-24 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-[2px] shadow-xl border border-white/15 dark:border-white/5 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <div className={`${step.color} group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 opacity-90"></div>
          <div className="relative bg-white/10 dark:bg-slate-900/10 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
              Ready to Transform Your
              <span className="block">Property Investments?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of investors who are already maximizing their returns with our intelligent platform.
              Start your journey today with a free account.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <button className="group bg-white text-purple-600 px-10 py-5 rounded-xl text-lg font-bold hover:bg-white/90 transition-all transform hover:scale-[1.01] shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                <span className="flex items-center">
                  Get Started Free
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
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