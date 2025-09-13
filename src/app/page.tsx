'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useEffect, useState } from 'react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Scroll reveal animation
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Navigation with Glass Morphism */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-strong border-b border-electric-blue/30' 
          : 'bg-black/60 backdrop-blur-sm border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold logo-glow transition-all duration-300">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  REXIN
                </span><span className="font-thin text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">DYNAMICS</span>
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="#about" 
                    className="px-4 py-2 hover:bg-electric-blue/20 hover:text-electric-blue rounded-md transition-all duration-300 hover-lift"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="#services" 
                    className="px-4 py-2 hover:bg-neon-green/20 hover:text-neon-green rounded-md transition-all duration-300 hover-lift"
                  >
                    Services
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="#team" 
                    className="px-4 py-2 hover:bg-cyber-purple/20 hover:text-cyber-purple rounded-md transition-all duration-300 hover-lift"
                  >
                    Team
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="#contact" 
                    className="px-4 py-2 hover:bg-tech-orange/20 hover:text-tech-orange rounded-md transition-all duration-300 hover-lift"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        {/* Enhanced Drone Light Show Background */}
        <div className="absolute inset-0">
          {/* Animated stars/drone lights */}
          <div className="absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full twinkle"
                style={{
                  left: `${(i * 7.3) % 100}%`,
                  top: `${(i * 11.7) % 100}%`,
                  animationDelay: `${(i * 0.1) % 3}s`,
                }}
              />
            ))}
          </div>
          
          {/* Enhanced moving drone formations */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`formation-${i}`}
                className="absolute w-2 h-2 rounded-full drone-light"
                style={{
                  left: `${(i * 13.7) % 100}%`,
                  top: `${(i * 19.3) % 100}%`,
                  animationDelay: `${(i * 0.2) % 5}s`,
                  background: i % 3 === 0 ? '#3b82f6' : 
                             i % 3 === 1 ? '#10b981' : '#8b5cf6',
                  boxShadow: i % 3 === 0 ? '0 0 10px #3b82f6' : 
                             i % 3 === 1 ? '0 0 10px #10b981' : '0 0 10px #8b5cf6',
                }}
              />
            ))}
          </div>

          {/* Additional particle effects */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full pulse"
                style={{
                  left: `${(i * 17.1) % 100}%`,
                  top: `${(i * 23.9) % 100}%`,
                  animationDelay: `${(i * 0.15) % 4}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="font-black text-white">
                REXIN
              </span>
              <span className="font-thin text-white">DYNAMICS</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Pioneering the future of aerial robotics.
            </p>
          </div>
        </div>

        {/* Enhanced Scroll Indicator - Positioned at bottom of viewport */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-400 mb-2 animate-pulse">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center float">
              <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-neon-green/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              About <span className="font-black text-white">REXIN</span><span className="font-thin">DYNAMICS</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              We are a cutting-edge drone and aerial robotics startup specializing in entertainment 
              and defense applications. Our innovative technology brings spectacular drone light shows 
              to life while developing confidential defense solutions for the future.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "100+", label: "Projects Completed" },
              { number: "50+", label: "Happy Clients" },
              { number: "24/7", label: "Support" },
              { number: "99%", label: "Success Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center scroll-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-cyber-purple/5 to-tech-orange/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              From spectacular entertainment to cutting-edge defense solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass hover-lift group scroll-reveal">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎆</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-electric-blue transition-colors duration-300">Drone Light Shows</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Spectacular aerial displays that combine precision flight with stunning visual effects. 
                  Perfect for events, celebrations, launches, etc.
                </p>
                <Button 
                  variant="outline" 
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black hover-lift transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </Card>

            <Card className="glass hover-lift group scroll-reveal" style={{ animationDelay: '0.2s' }}>
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-tech-orange rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-neon-green transition-colors duration-300">Defense Solutions</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Advanced aerial robotics technology for defense applications. 
                  Confidential projects coming soon with cutting-edge capabilities.
                </p>
                <Button 
                  variant="outline" 
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black hover-lift transition-all duration-300"
                >
                  Coming Soon
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section id="team" className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/5 to-electric-blue/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Our Team</h2>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Meet the visionaries behind Rexin Dynamics
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Siona Shaji", role: "MD", description: "Overseeing operations", color: "tech-orange", initials: "SS" },
              { name: "Junaid CK", role: "CTO", description: "Driving technical innovation", color: "neon-green", initials: "JC" },
              { name: "Arjun Raju", role: "CIO", description: "Managing information systems", color: "cyber-purple", initials: "AR" },
              { name: "Jerom Tom", role: "CEO", description: "Leading the vision and strategy", color: "electric-blue", initials: "JT" }
            ].map((member, index) => (
              <Card key={index} className="glass hover-lift group scroll-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-center p-6">
                  <div className={`w-20 h-20 bg-gradient-to-br from-${member.color} to-${member.color}/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl font-bold text-white">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-electric-blue transition-colors duration-300">{member.name}</h3>
                  <p className="text-gray-300 mb-2 font-medium">{member.role}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{member.description}</p>
                  
                  {/* Social Icons */}
                  <div className="flex justify-center space-x-3">
                    <a 
                      href="#" 
                      className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-gray-500/25"
                      aria-label={`${member.name} Email`}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Ready to explore the future of aerial robotics with us?
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Business Card Style Contact Card */}
            <Card className="hover-lift scroll-reveal overflow-hidden bg-gradient-to-br from-black/60 via-blue-900/20 to-purple-900/30 backdrop-blur-xl border border-blue-400/20">
              <div className="relative">
                {/* Glass Morphism Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 backdrop-blur-2xl"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-blue/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyber-purple/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                
                {/* Share Button - Top Right */}
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Rexin Dynamics - Pioneering the future of aerial robotics',
                          text: 'Check out Rexin Dynamics - Pioneering the future of aerial robotics',
                          url: 'https://rexindynamics.com'
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText('https://rexindynamics.com').then(() => {
                          alert('Link copied to clipboard!');
                        });
                      }
                    }}
                    className="w-10 h-10 bg-gradient-to-br from-electric-blue to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-electric-blue/25"
                    aria-label="Share Rexin Dynamics"
                    title="Share Rexin Dynamics"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="relative z-10 p-12">
                  {/* Company Logo and Name */}
                  <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold mb-4">
                      <span className="font-black text-white">
                        REXIN
                      </span>
                      <span className="font-normal text-white">DYNAMICS</span>
                    </h3>
                    <p className="text-lg text-gray-300 font-medium">Pioneering the future of aerial robotics</p>
                  </div>
                  
                  {/* Contact Information Grid */}
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Email */}
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-electric-blue/20 to-electric-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-electric-blue/25">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</h4>
                      <p className="text-gray-300 font-medium group-hover:text-electric-blue transition-colors duration-300">contact@rexindynamics.com</p>
                    </div>
                    
                    {/* Phone */}
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-green/20 to-neon-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-neon-green/25">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phone</h4>
                      <p className="text-gray-300 font-medium group-hover:text-neon-green transition-colors duration-300">+91 9383404844</p>
                  </div>
                    
                    {/* Location */}
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyber-purple/20 to-cyber-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyber-purple/25">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Location</h4>
                      <p className="text-gray-300 font-medium group-hover:text-cyber-purple transition-colors duration-300">Eranakulam, Kerala, India</p>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="mt-12 pt-8 border-t border-gray-600/50">
                    <div className="flex justify-center space-x-6">
                      <a 
                        href="https://linkedin.com/company/rexin-dynamics" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://rexindynamics.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-gray-500/25"
                        aria-label="Website"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </a>
                      <a 
                        href="https://instagram.com/rexindynamics" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-pink-500/25"
                        aria-label="Instagram"
                      >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-blue-400/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              <span className="font-black text-white">REXIN</span>
              <span className="font-thin ml-2">DYNAMICS</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Pioneering the future of aerial robotics
            </p>
            <p className="text-sm text-gray-400">
              © 2025 Rexin Dynamics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
