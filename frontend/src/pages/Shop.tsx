import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then(data => {
      if (Array.isArray(data)) {
        setProducts(data);
      }
    }).catch(err => console.error("Failed to load products", err))
      .finally(() => setLoading(false));
  }, []);

  const fallbackProducts = [
    { id: "flame", name: "Flame Edition", price: 1499, image: "/images/red.jpg" },
    { id: "core", name: "Core Edition", price: 1299, image: "/images/blue.jpg" },
    { id: "glow", name: "Glow Edition", price: 1599, image: "/images/white.jpg" },
    { id: "ai", name: "AI Edition", price: 1799, image: "/images/navi.jpg" },
  ];

  const displayProducts = products.length > 0 ? products : (loading ? [] : fallbackProducts);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-12">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground mb-2 sm:mb-4">
            Premium <span className="text-glow-red text-primary">Collection</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground px-4">
            Limited Edition Black T-Shirts
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto px-2 sm:px-4 mb-16 sm:mb-20 lg:mb-24">
          {displayProducts.map((product, index) => {
            // Adapt API product to ProductCard props
            // ProductCard expects: id, name, price, image
            // API product has: _id, name, price, images (array) or image (string)
            const imgSource = product.images && product.images.length > 0 ? product.images[0] : product.image;

            return (
              <div
                key={product._id || product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  id={product._id || product.id}
                  name={product.name}
                  price={product.price}
                  image={imgSource}
                />
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
