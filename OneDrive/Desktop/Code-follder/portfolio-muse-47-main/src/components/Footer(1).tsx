import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Dribbble, 
  Mail,
  ArrowUp 
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Dribbble, href: "#", label: "Dribbble" },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Brand Identity",
    "Web Design",
    "Packaging Design",
    "Photography",
    "Social Media Design",
    "Print Design",
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold font-playfair">
              Creative Studio
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Crafting exceptional visual experiences through innovative design, 
              brand identity, and digital artistry.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/80">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <a
                  href="mailto:hello@creativestudio.com"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  hello@creativestudio.com
                </a>
              </div>
              <div className="text-primary-foreground/80">
                San Francisco, CA
              </div>
            </div>
            <Button variant="cta" size="sm" className="mt-4">
              Start a Project
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-primary-foreground/60 text-sm">
            © 2024 Creative Studio. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-accent transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-accent transition-colors"
            >
              Terms of Service
            </a>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;