import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [cartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 group"
          onClick={closeMobileMenu}
        >
          <span className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
            Zenstee
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-foreground hover:text-primary transition-smooth relative ${isActiveLink('/') ? 'text-primary' : ''
              }`}
          >
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Home
            </span>
          </Link>
          <Link
            to="/shop"
            className={`text-foreground hover:text-primary transition-smooth relative ${isActiveLink('/shop') ? 'text-primary' : ''
              }`}
          >
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Shop
            </span>
          </Link>
          <Link
            to="/care"
            className={`text-foreground hover:text-primary transition-smooth relative ${isActiveLink('/care') ? 'text-primary' : ''
              }`}
          >
            <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Care
            </span>
          </Link>
          <Link
            to="/checkout"
            className={`relative text-foreground hover:text-primary transition-smooth ${isActiveLink('/checkout') ? 'text-primary' : ''
              }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-foreground hover:text-primary transition-smooth p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
                className={`block text-foreground hover:text-primary transition-smooth py-2 ${isActiveLink('/') ? 'text-primary font-bold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`block text-foreground hover:text-primary transition-smooth py-2 ${isActiveLink('/shop') ? 'text-primary font-bold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
              <Link
                to="/care"
                className={`block text-foreground hover:text-primary transition-smooth py-2 ${isActiveLink('/care') ? 'text-primary font-bold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                Care
              </Link>
              <Link
                to="/checkout"
                className={`flex items-center text-foreground hover:text-primary transition-smooth py-2 ${isActiveLink('/checkout') ? 'text-primary font-bold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
