import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, name, price, image }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/checkout", {
      state: {
        product: { id, name, price, image },
        size: "0-6 Months" // Default size for quick buy
      }
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const cartItem = {
      id,
      name,
      price,
      image,
      size: "0-6 Months", // Default size for quick add
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existingCart, cartItem]));
    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Added to Cart!",
      description: `${name} added to cart.`,
    });
  };

  return (
    <div className="group h-full flex flex-col">
      <Link to={`/product/${id}`} className="block">
        <div className="w-full aspect-square overflow-hidden rounded-lg mb-3 bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="text-center space-y-2 flex-1 flex flex-col">
        <Link to={`/product/${id}`} className="block">
          <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">{name}</h3>
        </Link>
        <p className="text-lg sm:text-xl font-black text-primary">₹{price}</p>

        <div className="mt-auto space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="sm"
              className="w-full text-xs px-1 h-9"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-1 h-9"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
