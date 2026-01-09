import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroVideo1 from "@/assets/hero-1.mp4";
import heroVideo2 from "@/assets/hero-2.mp4";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.getProducts().then(data => {
      // If data is array
      if (Array.isArray(data)) {
        setProducts(data);
      }
    }).catch(err => console.error("Failed to load products", err));
  }, []);

  const featuredProducts = [
    { name: "Flame Edition", video: heroVideo1, image: "/images/red.jpg" },
    { name: "Core Edition", video: heroVideo2, image: "/images/blue.jpg" },
    { name: "Glow Edition", video: heroVideo1, image: "/images/white.jpg" },
  ];

  const displayProducts = products.length > 0 ? products : [
    { _id: 'flame', name: 'Flame Edition', image: '/images/red.jpg' },
    { _id: 'core', name: 'Core Edition', image: '/images/blue.jpg' },
    { _id: 'glow', name: 'Glow Edition', image: '/images/white.jpg' },
    { _id: 'ai', name: 'AI Edition', image: '/images/navi.jpg' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8">
              <span className="text-foreground">THE FIRE OF </span>
              <span className="text-glow-red text-primary">INNOVATION</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
              Wear the Future — <span className="text-foreground">Zenstee</span>
            </p>
          </div>

          {/* Carousel with T-Shirt Images and Videos */}
          <div className="relative mb-8 sm:mb-12">
            <Carousel className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto">
              <CarouselContent>
                {featuredProducts.map((product, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4">
                      {/* T-Shirt Image - Left Side */}
                      <div className="flex-1 animate-fade-in w-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-sm xl:max-w-md mx-auto rounded-lg shadow-2xl animate-float"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        />
                      </div>

                      {/* Video - Right Side */}
                      <div className="flex-1 animate-fade-in w-full" style={{ animationDelay: '0.3s' }}>
                        <div className="aspect-square overflow-hidden rounded-lg animate-float max-w-[280px] sm:max-w-[320px] lg:max-w-sm xl:max-w-md mx-auto" style={{ animationDelay: '0.5s' }}>
                          <video
                            src={product.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-lg shadow-2xl"
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Products Grid Section */}
          <div className="mt-8 sm:mt-12 lg:mt-20 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-6 sm:mb-8 lg:mb-12 animate-fade-in px-4">
              <span className="text-foreground">OUR </span>
              <span className="text-glow-red text-primary">COLLECTION</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-2xl sm:max-w-4xl mx-auto px-4">
              {displayProducts.map((product: any, index: number) => {
                // Resolve image URL
                const imgSource = product.images && product.images.length > 0 ? product.images[0] : product.image;
                // If it's a relative backend path (e.g. /uploads/...), keep it as is because proxy handles it?
                // Wait, <img src="/uploads/..."> works if proxy forwards it.
                // But wait, if backend returns just "uploads/file.jpg" (no slash), we need to handle it.
                // Backend uploadRoutes returns `/${req.file.path}` -> `/uploads/...`.
                // So straightforward relative path works with proxy!
                // Legacy hardcoded image is "/images/red.jpg". Also works.

                const displayImage = imgSource; // Proxy or static asset

                return (
                  <Link
                    key={product._id || product.id}
                    to={`/product/${product._id || product.id}`}
                    className="group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                          <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">{product.name}</h3>
                          {product.price && <p className="text-white/80 text-xs sm:text-sm">₹{product.price}</p>}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-16 sm:mb-20 lg:mb-24">
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-glow-pulse w-full sm:w-auto"
              >
                Shop Now
              </Button>
            </Link>
            <Link to="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
