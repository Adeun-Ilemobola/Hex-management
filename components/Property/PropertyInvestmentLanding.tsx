"use client";

import Link from 'next/link';
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
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Github
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Pricing Analytics",
      description: "AI-powered algorithms analyze market data to give you the optimal price for maximum returns.",
      gradient: "from-[#db2777] to-[#9333ea]" // Highlight to Accent
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Pooled Investment System",
      description: "Create or join investment pools. Leaders control distribution while investors have voting rights.",
      gradient: "from-[#2563eb] to-[#9333ea]" // Primary to Accent
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Direct Tenant Comms",
      description: "Built-in messaging system for seamless communication between owners, agents, and tenants.",
      gradient: "from-[#9333ea] to-[#db2777]"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Auto-Invoicing",
      description: "Generate professional invoices automatically for rent, maintenance, and expenses.",
      gradient: "from-[#db2777] to-[#2563eb]"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Monitor your individual and pooled investments with enterprise-grade security encryption.",
      gradient: "from-[#db2777] to-[#9333ea]"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "All-in-One Dashboard",
      description: "Manage buying, selling, renting, and investor relations from a single command center.",
      gradient: "from-[#2563eb] to-[#db2777]"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Add Property",
      description: "Input details and let AI analyze market conditions.",
      icon: <Home className="w-8 h-8" />,
      color: "text-[#db2777]" // Highlight
    },
    {
      step: "02",
      title: "Smart Pricing",
      description: "Receive data-driven recommendations to maximize ROI.",
      icon: <Target className="w-8 h-8" />,
      color: "text-[#2563eb] dark:text-[#d8b4fe]" // Primary
    },
    {
      step: "03",
      title: "Choose Strategy",
      description: "Go individual or create investment pools.",
      icon: <Briefcase className="w-8 h-8" />,
      color: "text-[#9333ea] dark:text-[#a855f7]" // Accent
    },
    {
      step: "04",
      title: "Profit & Scale",
      description: "Track returns and grow your portfolio securely.",
      icon: <DollarSign className="w-8 h-8" />,
      color: "text-[#db2777] dark:text-[#f472b6]" // Highlight
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#f5f3ff] to-[#fce7f3] dark:from-[#0f172a] dark:via-[#2e1065]/40 dark:to-[#0f172a] overflow-x-hidden selection:bg-[#d8b4fe] selection:text-[#2563eb]">
      
      {/* --- Ambient Background Blobs (Global) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2563eb]/20 dark:bg-[#2563eb]/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#db2777]/20 dark:bg-[#db2777]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
         <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] bg-[#9333ea]/20 dark:bg-[#9333ea]/10 rounded-full blur-[100px] animate-pulse delay-500"></div>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative max-w-7xl mx-auto text-center">
          
          {/* Glass Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 dark:bg-white/5 backdrop-blur-[16px] ring-1 ring-white/50 dark:ring-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-[#db2777] mr-2" />
            <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold tracking-wide">
              The Future of Property Investment
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both drop-shadow-sm">
            <span className="text-slate-900 dark:text-white">Maximize Your</span>
            <br />
            <span className="bg-gradient-to-r from-[#db2777] via-[#9333ea] to-[#2563eb] bg-clip-text text-transparent">
              Property Returns
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both drop-shadow-sm">
            The all-in-one platform for intelligent pricing, tenant management, and collaborative investment pools.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 fill-mode-both">
            <Link href="/login">
                {/* Primary Button - Slightly translucent gradient */}
                <button className="group relative bg-gradient-to-r from-[#db2777]/90 via-[#9333ea]/90 to-[#2563eb]/90 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] active:scale-95 ring-1 ring-white/20">
                    <span className="flex items-center">
                        Start Investing
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </Link>
            <Link href="/about">
                {/* Glass Button */}
                <button className="px-8 py-4 rounded-xl text-lg font-bold text-slate-800 dark:text-white bg-white/30 dark:bg-white/5 ring-1 ring-white/50 dark:ring-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-all backdrop-blur-[13px] shadow-lg">
                    Learn More
                </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Stats Section (Glass Strip) --- */}
      <section className="relative z-10 py-10 border-y border-white/20 dark:border-white/5 bg-white/20 dark:bg-black/20 backdrop-blur-[20px] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { label: "Active Investors", value: "10,000+" },
                { label: "Property Value", value: "$500M+" },
                { label: "Avg. Return", value: "12.5%" },
                { label: "Countries", value: "24" },
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-md">
                        {stat.value}
                    </div>
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section className="relative z-10 py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 drop-shadow-sm">
                Everything You Need To <span className="text-[#db2777]">Succeed</span>
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              /* Glass Card */
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-[20px] ring-1 ring-white/60 dark:ring-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-white/60 dark:hover:bg-slate-800/50 hover:ring-white/80 dark:hover:ring-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-90 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:opacity-100 transition-all shadow-lg`}>
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {feature.description}
                </p>
              </div>
            ))}
        </div>
      </section>

      {/* --- Investment Types --- */}
      <section className="relative z-10 py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Glass Card 1 - Individual */}
            <div className="relative overflow-hidden rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-[20px] ring-1 ring-white/60 dark:ring-white/10 p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
                {/* Decorative Blur Inside Card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#db2777]/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#db2777]/10 flex items-center justify-center text-[#db2777] mb-8 ring-1 ring-[#db2777]/20 backdrop-blur-md">
                        <UserCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Individual Investor</h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-8 text-lg font-medium">
                        Take full control. Ideal for investors who want complete ownership and decision-making power.
                    </p>
                    <ul className="space-y-4 mb-10">
                        {["100% Ownership", "Custom Pricing Strategy", "Direct Control"].map((item) => (
                            <li key={item} className="flex items-center text-slate-800 dark:text-slate-200 font-semibold">
                                <CheckCircle className="w-5 h-5 text-[#db2777] mr-3" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link href="/signup?type=individual" className="block text-center w-full py-4 rounded-xl border-2 border-[#db2777]/30 dark:border-[#db2777]/50 font-bold text-slate-900 dark:text-white hover:bg-[#db2777]/10 hover:border-[#db2777] transition-all backdrop-blur-sm">
                        Start Solo
                    </Link>
                </div>
            </div>

            {/* Glass Card 2 - Pool */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 dark:bg-black/60 backdrop-blur-[20px] ring-1 ring-white/10 p-8 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563eb]/30 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#2563eb]/20 flex items-center justify-center text-[#2563eb] dark:text-[#d8b4fe] mb-8 ring-1 ring-[#2563eb]/30 backdrop-blur-md">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Pooled Investment</h3>
                    <p className="text-slate-300 mb-8 text-lg font-medium">
                        Stronger together. Join forces to access premium properties and diversify risk.
                    </p>
                    <ul className="space-y-4 mb-10">
                        {["Access Premium Assets", "Shared Risk", "Democratic Voting"].map((item) => (
                            <li key={item} className="flex items-center text-slate-200 font-semibold">
                                <CheckCircle className="w-5 h-5 text-[#2563eb] dark:text-[#d8b4fe] mr-3" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link href="/signup?type=pool" className="block text-center w-full py-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#9333ea] font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-blue-900/20 ring-1 ring-white/20">
                        Join a Pool
                    </Link>
                </div>
            </div>
          </div>
      </section>

      {/* --- Steps --- */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-black mb-16 text-slate-900 dark:text-white drop-shadow-sm">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group text-center">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-[2px] bg-gradient-to-r from-slate-300/50 to-transparent dark:from-slate-700/50 transform translate-x-8"></div>
                )}
                {/* Glass Circle */}
                <div className="relative mx-auto w-20 h-20 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-[13px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] ring-1 ring-white/50 dark:ring-white/10 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:bg-white/60 dark:group-hover:bg-white/10 transition-all duration-300">
                    <div className={step.color}>{step.icon}</div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-md">
                        {step.step}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{step.description}</p>
              </div>
            ))}
        </div>
      </section>

      {/* --- CTA Box --- */}
      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            {/* Glass Overlay on Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#db2777] via-[#9333ea] to-[#2563eb]"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px]"></div> 
            
            <div className="relative p-12 md:p-24 text-center z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-md">Ready to Scale?</h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                    Join thousands of investors maximizing their returns with Hex.
                </p>
                <Link href="/login">
                    <button className="bg-white/90 backdrop-blur-md text-[#9333ea] px-10 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors shadow-2xl ring-1 ring-white/50">
                        Get Started Now
                    </button>
                </Link>
            </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 border-t border-white/30 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-[20px] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                    <Link href="/" className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#db2777] to-[#2563eb] flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-[#db2777] to-[#2563eb] bg-clip-text text-transparent">Hex</span>
                    </Link>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 font-medium">
                        Revolutionizing property investment through technology and collaboration.
                    </p>
                    <div className="flex space-x-4">
                        {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                            <a key={i} href="#" className="text-slate-600 dark:text-slate-400 hover:text-[#9333ea] dark:hover:text-[#a855f7] transition-colors">
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
                
                {[
                    { head: "Platform", links: ["Browse Properties", "Analytics", "Pricing", "API"] },
                    { head: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
                    { head: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
                ].map((col, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">{col.head}</h4>
                        <ul className="space-y-2">
                            {col.links.map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#9333ea] dark:hover:text-[#d8b4fe] transition-colors font-medium">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            <div className="pt-8 border-t border-white/20 dark:border-white/5 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">© 2026 Hex Platform. All rights reserved.</p>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">System Operational</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};