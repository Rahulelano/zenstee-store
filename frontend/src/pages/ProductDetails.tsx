import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const ProductDetails = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("0-6 Months");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const products = {
    flame: {
      name: "Flame Edition",
      price: 1499,
      image: "/images/red.jpg",
      gallery: ["/images/red.jpg", "/images/blue.jpg", "/images/white.jpg", "/images/navi.jpg", "/images/red.jpg"]
    },
    core: {
      name: "Core Edition",
      price: 1299,
      image: "/images/blue.jpg",
      gallery: ["/images/blue.jpg", "/images/red.jpg", "/images/white.jpg", "/images/navi.jpg", "/images/blue.jpg"]
    },
    glow: {
      name: "Glow Edition",
      price: 1599,
      image: "/images/white.jpg",
      gallery: ["/images/white.jpg", "/images/red.jpg", "/images/blue.jpg", "/images/navi.jpg", "/images/white.jpg"]
    },
    ai: {
      name: "AI Edition",
      price: 1799,
      image: "/images/navi.jpg",
      gallery: ["/images/navi.jpg", "/images/red.jpg", "/images/blue.jpg", "/images/white.jpg", "/images/navi.jpg"]
    },
  };

  const productData = products[id as keyof typeof products];
  const [product, setProduct] = useState<any>(productData || null);

  useEffect(() => {
    if (!productData && id) {
      // Try fetching from API
      import("@/lib/api").then(({ api }) => {
        api.getProduct(id).then(data => {
          // Transform API data to match component structure if needed
          // API returns: { name, price, description, images: [], category, stock, sizes }
          // Component expects: { name, price, image, gallery } + description/sizes elsewhere? 
          // The component reads `product.image` and `product.gallery`.
          // We need to map API response.
          setProduct({
            ...data,
            image: data.images[0],
            gallery: data.images
          });
          setActiveImage(data.images[0]);
        }).catch(err => console.error("Failed to fetch product", err));
      });
    } else if (productData && !activeImage) {
      setActiveImage(productData.image);
    }
  }, [id, productData]);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        product: {
          ...product,
          image: activeImage || product.image
        },
        size: selectedSize
      }
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      image: activeImage || product.image,
      size: selectedSize,
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existingCart, cartItem]));

    // Dispatch custom event to update header cart count if implemented
    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Added to Cart!",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

  if (!product) {
    return <div>Product not found or Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          {/* Product Image Gallery */}
          <div className="animate-fade-in order-1 md:order-1 flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-b from-primary/20 to-transparent p-4 sm:p-6 lg:p-8">
              <img
                src={(() => {
                  const img = activeImage || product.image;
                  if (!img) return "";
                  if (img.startsWith("http")) return img;
                  const uploadIndex = img.indexOf("/uploads/");
                  return uploadIndex !== -1 ? img.substring(uploadIndex) : img;
                })()}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {product.gallery.map((img: string, index: number) => {
                // Use relative path directly. 
                // If img is "/images/..." or "/uploads/...", it works via Proxy/Static.
                // If it is a full URL (external), it works as is.
                // Robustness: Handle absolute paths from legacy/cached backend logic by extracting /uploads/
                let displayUrl = img;
                if (!displayUrl.startsWith("http")) {
                  const uploadIndex = displayUrl.indexOf("/uploads/");
                  if (uploadIndex !== -1) {
                    displayUrl = displayUrl.substring(uploadIndex);
                  }
                }

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? "border-primary" : "border-transparent hover:border-primary/50"
                      }`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img
                      src={displayUrl}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6 animate-fade-in order-2 md:order-2" style={{ animationDelay: "0.2s" }}>
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-primary">₹{product.price}</p>
            </div>

            <div className="border-t border-border pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-bold mb-4 text-foreground text-center md:text-left">Age Range</h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex justify-center md:justify-start space-x-4 flex-wrap gap-2">
                  {(product.sizes || [
                    "0-6 Months",
                    "0-1 Years",
                    "1-2 Years",
                    "3-4 Years",
                    "5-6 Years",
                    "7-8 Years",
                    "9-10 Years",
                    "11-12 Years"
                  ]).map((size: string) => (
                    <div key={size} className="flex items-center">
                      <RadioGroupItem value={size} id={size} className="border-border" />
                      <Label
                        htmlFor={size}
                        className="ml-2 cursor-pointer text-foreground hover:text-primary whitespace-nowrap"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="border-t border-border pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-bold mb-4 text-foreground text-center md:text-left">Description</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center md:text-left px-4 md:px-0">
                {product.description || "Premium black cotton T-shirt featuring the exclusive Zenstee. Each piece is limited edition, designed for those who wear innovation."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-lg py-4 sm:py-6"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-foreground hover:bg-foreground/90 text-background text-sm sm:text-lg py-4 sm:py-6"
              >
                Buy Now
              </Button>
            </div>

            <Link
              to="/care"
              className="block text-center text-primary hover:text-primary/80 underline mt-4"
            >
              View Care Instructions
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
