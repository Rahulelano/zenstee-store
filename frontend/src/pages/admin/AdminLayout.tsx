import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Home, LogOut, Menu } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        console.log("AdminLayout checked token:", token ? "Present" : "Missing");
        if (!token) {
            console.log("Token missing, redirecting to login");
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const isActive = (path: string) => location.pathname === path;

    const NavContent = () => (
        <div className="h-full flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <span className="text-xl font-bold text-foreground">
                    Zenstee Admin
                </span>
            </div>
            <nav className="p-4 space-y-2 flex-1">
                <Link
                    to="/admin"
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive("/admin")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                </Link>
                <Link
                    to="/admin/products"
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${location.pathname.startsWith("/admin/products")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    <Package className="w-5 h-5" />
                    <span>Products</span>
                </Link>
                <Link
                    to="/admin/orders"
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${location.pathname.startsWith("/admin/orders")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Orders</span>
                </Link>

                <div className="pt-8 border-t border-border mt-8 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Store</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r border-border bg-card">
                <NavContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col min-h-screen">
                <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-8 bg-card shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-64">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <SheetDescription className="sr-only">Admin panel navigation links</SheetDescription>
                                    <NavContent />
                                </SheetContent>
                            </Sheet>
                        </div>
                        <h1 className="text-lg font-semibold text-foreground">
                            {location.pathname === "/admin" ? "Dashboard" : "Products Management"}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-4 sm:p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
