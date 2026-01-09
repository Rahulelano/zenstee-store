import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="flex space-x-4 sm:space-x-6">
            <a
              href="#"
              className="text-foreground hover:text-primary transition-smooth"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="text-foreground hover:text-primary transition-smooth"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="text-foreground hover:text-primary transition-smooth"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
            © 2025 Zenstee — The Fire of Innovation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
