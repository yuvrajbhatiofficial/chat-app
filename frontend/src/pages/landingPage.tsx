import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from "next/router";
import { FiMessageCircle, FiUsers, FiZap, FiShield, FiMenu, FiX, FiArrowDown, FiStar, FiGlobe, FiHome, FiLayers, FiBarChart, FiInfo, FiMail } from 'react-icons/fi';
import Preloader from '../components/Preloader'; // Add this import
const LandingPage = () => {
   const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const backgroundRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  // Smooth scroll function
  const smoothScrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Initialize loading state
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ['home', 'features', 'stats', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced mouse tracking for gradient effects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      
      // Smooth gradient following with easing
      setGradientPosition(prev => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated gradient background effect
  useEffect(() => {
    const animateGradient = () => {
      if (!backgroundRef.current) return;
      
      const time = Date.now() * 0.001;
      const baseX = 50 + Math.sin(time * 0.5) * 20;
      const baseY = 50 + Math.cos(time * 0.3) * 15;
      
      // Combine mouse position with animation
      const finalX = (gradientPosition.x + baseX) / 2;
      const finalY = (gradientPosition.y + baseY) / 2;
      
      backgroundRef.current.style.background = `
        radial-gradient(
          circle at ${finalX}% ${finalY}%,
          rgba(255, 255, 255, 0.15) 0%,
          rgba(255, 255, 255, 0.1) 20%,
          rgba(255, 255, 255, 0.05) 40%,
          rgba(0, 0, 0, 0.8) 70%,
          rgba(0, 0, 0, 0.95) 100%
        ),
        linear-gradient(
          ${time * 20}deg,
          rgba(255, 255, 255, 0.03) 0%,
          transparent 50%,
          rgba(255, 255, 255, 0.03) 100%
        )
      `;
      
      requestAnimationFrame(animateGradient);
    };
    
    animateGradient();
  }, [gradientPosition]);

  // Floating elements animation
  useEffect(() => {
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.className = 'floating-particle';
      element.style.cssText = `
        position: fixed;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        animation: floatUp ${Math.random() * 10 + 15}s linear infinite;
      `;
      
      document.body.appendChild(element);
      
      setTimeout(() => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      }, 25000);
    };

    const interval = setInterval(createFloatingElement, 2000);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        50% {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
        }
      }
      
      .hover-reveal {
        position: relative;
        overflow: hidden;
      }
      
      .hover-reveal::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          rgba(59, 130, 246, 0.1) 0%,
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      
      .hover-reveal:hover::before {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      clearInterval(interval);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const navItems = [
    { id: 'home', icon: FiHome, label: 'Home' },
    { id: 'features', icon: FiLayers, label: 'Features' },
    { id: 'stats', icon: FiBarChart, label: 'Stats' },
    { id: 'about', icon: FiInfo, label: 'About' },
    { id: 'contact', icon: FiMail, label: 'Contact' }
  ];
  const handleGetStarted = () =>{
      router.push("/login");
  };
  const features = [
    {
      icon: <FiMessageCircle className="w-6 h-6" />,
      title: "Real-time Messaging",
      description: "Lightning-fast communication with WebSocket technology for instant message delivery."
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Smart Presence",
      description: "Advanced online presence detection with typing indicators and last-seen timestamps."
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Ultra Performance",
      description: "Optimized React architecture with intelligent caching for seamless experience."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Military-grade encryption and privacy-first design to protect conversations."
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Multi-language support with global CDN distribution for worldwide access."
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "AI-Powered",
      description: "Smart suggestions, intelligent notifications, and automated moderation."
    }
  ];

  const stats = [
    { number: "10k+", label: "Active Users", icon: <FiUsers className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <FiShield className="w-5 h-5" /> },
    { number: "<1ms", label: "Latency", icon: <FiZap className="w-5 h-5" /> },
    { number: "24/7", label: "Support", icon: <FiMessageCircle className="w-5 h-5" /> }
  ];

  return (
    <>
    {/* Preloader */}
      <Preloader 
        isLoading={isLoading}
        onComplete={() => console.log('Loading complete!')}
        showProgress={true}
        duration={3000}
      />
    <div className={`relative min-h-screen bg-gray-900 text-gray-100 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated Background */}
      <div ref={backgroundRef} className="fixed inset-0 z-0" />
      
      {/* Three.js Background Mount Point */}
      <div ref={mountRef} className="fixed inset-0 z-0" />

      {/* Elegant Vertical Navigation */}
      <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col items-center space-y-1 p-3 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/30">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => smoothScrollTo(item.id)}
                className={`group relative p-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'hover:bg-gray-700/40 text-gray-400 hover:text-gray-200'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <div className="absolute left-full ml-4 px-3 py-1 bg-gray-800 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {item.label}
                </div>
                {activeSection === item.id && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 p-3 bg-gray-800/70 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:bg-gray-700/70 transition-all duration-200"
      >
        {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMenuOpen ? 'bg-gray-900/95 backdrop-blur-xl' : 'bg-transparent pointer-events-none'
      }`}>
        <div className={`flex items-center justify-center min-h-screen transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="text-center space-y-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    smoothScrollTo(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-4 text-xl hover:text-blue-400 transition-colors duration-200"
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-4xl" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <div className="mb-8 transform transition-all duration-1000" style={{ transform: isLoaded ? 'translateY(0)' : 'translateY(20px)' }}>
            <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-gray-100 via-blue-400 to-gray-100 bg-clip-text text-transparent">
              DevChat
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-8" />
          </div>
          <p className="text-lg md:text-xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the future of communication with elegant design, powerful features, 
            and seamless real-time messaging that connects people effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </button>
            <button 
              onClick={() => smoothScrollTo('about')}
              className="px-8 py-3 border border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 rounded-xl text-sm font-medium transition-all duration-200"
            >
              Learn More
            </button>
          </div>
          <button 
            onClick={() => smoothScrollTo('features')}
            className="text-gray-500 hover:text-gray-300 transition-colors duration-200 animate-bounce"
          >
            <FiArrowDown className="w-6 h-6 mx-auto" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-6 text-gray-100">
              Powerful Features
            </h2>
            <div className="w-16 h-px bg-blue-400 mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Discover the capabilities that make DevChat the most elegant communication platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-800/30 transition-all duration-300"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-3 text-gray-200">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-gray-100">
            Trusted Globally
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:bg-gray-800/30 transition-all duration-300"
              >
                <div className="text-blue-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-light text-gray-100 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light mb-8 text-gray-100">
            Built for Excellence
          </h2>
          <div className="w-16 h-px bg-blue-400 mx-auto mb-8" />
          <p className="text-gray-400 mb-12 leading-relaxed font-light">
            Crafted with modern technologies and attention to detail, DevChat delivers 
            an unparalleled messaging experience that combines beautiful design with 
            powerful functionality and enterprise-grade security.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {['Modern', 'Secure', 'Fast'].map((item, index) => (
              <div
                key={item}
                className="p-6 bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/30"
              >
                <div className="text-2xl font-light text-blue-400 mb-2">{String(index + 1).padStart(2, '0')}</div>
                <div className="text-lg font-medium mb-2 text-gray-200">{item}</div>
                <div className="text-gray-400 text-sm font-light">
                  {item === 'Modern' && 'Built with React, Socket.io ,Prism.js and TypeScript'}
                  {item === 'Secure' && 'End-to-end encryption and privacy protection'}
                  {item === 'Fast' && 'Optimized performance and instant messaging'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light mb-8 text-gray-100">
            Start Your Journey
          </h2>
          <div className="w-16 h-px bg-blue-400 mx-auto mb-8" />
          <p className="text-gray-400 mb-12 leading-relaxed font-light">
            Join millions of users who have discovered the future of communication. 
            Experience messaging re-imagined with DevChat.
          </p>
          <button 
          onClick={handleGetStarted}
          className="px-12 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
            Get Started
          </button>
          <div className="mt-6 text-sm text-gray-500 font-light">
            Free forever • No credit card required
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <FiMessageCircle className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-light text-gray-200">DevChat</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              {['Privacy', 'Terms', 'Support', 'API', 'Status'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-gray-200 transition-colors duration-200 font-light"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm font-light">
            © 2025 DevChat. Crafted with precision for the future of communication.
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;