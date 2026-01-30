import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioItem {
  id: string;
  title: string;
  category: string[];
  cover_url: string;
  summary?: string;
  tools?: string[];
  featured: boolean;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Branding", 
    "Web Design", 
    "Packaging", 
    "Photography", 
    "Social Media", 
    "Print Design"
  ];

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
    }
    setLoading(false);
  };

  const getCategoryDisplayName = (category: string[]) => {
    const categoryMap: { [key: string]: string } = {
      'branding': 'Branding',
      'web_design': 'Web Design',
      'packaging': 'Packaging',
      'photography': 'Photography',
      'social_media': 'Social Media',
      'print_design': 'Print Design',
      'logos': 'Logos',
      'banners': 'Banners',
      'product_design': 'Product Design'
    };
    
    return category.map(cat => categoryMap[cat] || cat).join(', ');
  };

  const filteredItems = activeFilter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => {
        const displayCategory = getCategoryDisplayName(item.category);
        return displayCategory.includes(activeFilter);
      });

  return (
    <section id="portfolio" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Work</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A curated selection of my most impactful design projects, 
            showcasing creativity, strategy, and exceptional execution.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "cta" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className="transition-all duration-300"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-64 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No portfolio items found. Check back soon for updates!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden hover:shadow-large transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {item.featured && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button variant="glass" size="icon">
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button variant="glass" size="icon">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {item.summary || "Creative design project"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tools?.map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    )) || (
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryDisplayName(item.category)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;