import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import aboutPicture from "../assets/Profile_pic.png";
import { Download, Award, Users, Coffee } from "lucide-react";

const About = () => {
  const skills = [
    "Adobe Creative Suite",
    "Figma",
    "Sketch",
    "Webflow",
    "Typography",
    "Color Theory",
    "Brand Strategy",
    "UI/UX Design",
    "Print Design",
    "Photography",
    "Illustration",
    "Motion Graphics"
  ];

  const achievements = [
    { icon: Award, number: "50+", label: "Awards Won" },
    { icon: Users, number: "200+", label: "Happy Clients" },
    { icon: Coffee, number: "1000+", label: "Projects Completed" },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a passionate graphic designer with over 8 years of experience 
                creating compelling visual stories that connect brands with their audiences. 
                My approach combines strategic thinking with creative execution to deliver 
                designs that not only look stunning but also drive results.
              </p>
              <p>
                From startup branding to enterprise-level campaigns, I've had the 
                privilege of working with diverse clients across industries, helping 
                them establish their visual identity and communicate their unique value 
                proposition through thoughtful design.
              </p>
              <p>
                When I'm not designing, you can find me exploring new creative techniques, 
                staying updated with design trends, or mentoring aspiring designers in 
                the community.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Button variant="cta" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
            </div>
          </div>

          {/* Profile & Stats */}
          <div className="animate-scale-in">
            <Card className="overflow-hidden shadow-large">
              <div className="aspect-square bg-gradient-card">
                <img
                  src={aboutPicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Sachin Rathore</h3>
                <p className="text-muted-foreground mb-6"> Graphic Designer</p>
                
                <div className="grid grid-cols-3 gap-4">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div key={achievement.label} className="text-center">
                        <div className="w-12 h-12 bg-accent-muted rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <div className="text-2xl font-bold text-accent">
                          {achievement.number}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;