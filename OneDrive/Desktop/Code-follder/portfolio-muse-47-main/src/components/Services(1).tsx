import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Monitor, 
  Package, 
  Camera, 
  Smartphone, 
  FileText,
  ArrowRight 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: "Brand Identity",
      description: "Complete brand identity packages including logos, color palettes, typography, and brand guidelines.",
      features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography"],
      price: "Starting at $2,500"
    },
    {
      icon: Monitor,
      title: "Web Design",
      description: "Modern, responsive websites that engage users and drive conversions across all devices.",
      features: ["UI/UX Design", "Responsive Layout", "Prototyping", "User Testing"],
      price: "Starting at $3,500"
    },
    {
      icon: Package,
      title: "Packaging Design",
      description: "Eye-catching packaging designs that stand out on shelves and communicate your brand values.",
      features: ["Product Packaging", "Label Design", "Mockups", "Print Ready"],
      price: "Starting at $1,800"
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Professional product and lifestyle photography that showcases your brand in the best light.",
      features: ["Product Photos", "Lifestyle Shots", "Retouching", "Brand Photography"],
      price: "Starting at $800"
    },
    {
      icon: Smartphone,
      title: "Social Media",
      description: "Cohesive social media designs that build engagement and grow your online presence.",
      features: ["Post Templates", "Story Designs", "Highlight Covers", "Ad Creatives"],
      price: "Starting at $1,200"
    },
    {
      icon: FileText,
      title: "Print Design",
      description: "Professional print materials that make a lasting impression on your audience.",
      features: ["Brochures", "Business Cards", "Posters", "Magazines"],
      price: "Starting at $600"
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive design solutions tailored to elevate your brand 
            and connect with your audience across all touchpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.title}
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-border/50"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-accent-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-accent">
                        {service.price}
                      </span>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="cta" size="lg">
            Request Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;