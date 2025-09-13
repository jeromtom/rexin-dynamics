import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="font-black">REXIN</span>
                <span className="font-thin">DYNAMICS</span>
              </h1>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#about" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors">
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#services" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors">
                    Services
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#team" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors">
                    Team
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#contact" className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors">
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section with Drone Light Show Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Drone Light Show Background */}
        <DroneLightShow />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="font-black">REXIN</span>
            <br />
            <span className="font-thin">DYNAMICS</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Pioneering the future of aerial robotics in entertainment and defense
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Explore Our Technology
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              View Drone Shows
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="font-black">REXIN</span><span className="font-thin">DYNAMICS</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              We are a cutting-edge drone and aerial robotics startup specializing in entertainment 
              and defense applications. Our innovative technology brings spectacular drone light shows 
              to life while developing confidential defense solutions for the future.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From spectacular entertainment to cutting-edge defense solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border-gray-700 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎆</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Drone Light Shows</h3>
                <p className="text-gray-300 mb-6">
                  Spectacular aerial displays that combine precision flight with stunning visual effects. 
                  Perfect for events, celebrations, and entertainment venues.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-700 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Defense Solutions</h3>
                <p className="text-gray-300 mb-6">
                  Advanced aerial robotics technology for defense applications. 
                  Confidential projects coming soon with cutting-edge capabilities.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Coming Soon
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Meet the visionaries behind Rexin Dynamics
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Jerom Tom", role: "CEO", description: "Leading the vision and strategy" },
              { name: "Junaid CK", role: "CTO", description: "Driving technical innovation" },
              { name: "Arjun Raju", role: "CIO", description: "Managing information systems" },
              { name: "Siona Shaji", role: "MD", description: "Overseeing operations" }
            ].map((member, index) => (
              <Card key={index} className="bg-black border-gray-700 p-6 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{member.name}</h3>
                <p className="text-gray-300 mb-2">{member.role}</p>
                <p className="text-sm text-gray-400">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Ready to explore the future of aerial robotics with us?
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-900 border-gray-700 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
                <div className="space-y-4">
                  <p className="text-gray-300">Email: info@rexindynamics.com</p>
                  <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
                  <p className="text-gray-300">Location: Global Operations</p>
                </div>
                <Button className="mt-8 bg-white text-black hover:bg-gray-200">
                  Send Message
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              <span className="font-black">REXIN</span>
              <span className="font-thin">DYNAMICS</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Pioneering the future of aerial robotics
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Rexin Dynamics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
