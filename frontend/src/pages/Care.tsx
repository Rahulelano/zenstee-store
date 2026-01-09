import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Droplet, Flame, Shirt, Wind } from "lucide-react";

const Care = () => {
  const careInstructions = [
    {
      icon: Droplet,
      title: "Wash Cold",
      description: "Machine wash cold with like colors to preserve the fabric quality"
    },
    {
      icon: Flame,
      title: "Do Not Bleach",
      description: "Avoid bleach to maintain the deep black color and logo vibrancy"
    },
    {
      icon: Shirt,
      title: "Iron Inside Out",
      description: "Iron on low heat, inside out to protect the printed design"
    },
    {
      icon: Wind,
      title: "Do Not Tumble Dry",
      description: "Air dry or tumble dry on low to prevent shrinkage"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground mb-2 sm:mb-4">
              T-Shirt <span className="text-glow-red text-primary">Care</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground px-4">
              Keep your premium tee looking fresh
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24">
            {careInstructions.map((item, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4 sm:p-6 animate-fade-in hover:border-primary transition-smooth"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center sm:text-left">
              Additional Care Tips
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-muted-foreground text-center sm:text-left">
              <li>• Turn the T-shirt inside out before washing</li>
              <li>• Wash separately for the first few washes to prevent color transfer</li>
              <li>• Store in a cool, dry place away from direct sunlight</li>
              <li>• Avoid harsh detergents or fabric softeners</li>
              <li>• Handle the printed area gently to ensure longevity</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Care;
