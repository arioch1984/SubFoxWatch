import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, LogOut, Settings, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/add', icon: PlusCircle, label: 'Add Subscription' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
                <div className="mb-8 flex items-center gap-3 px-2">
                    <img src="/logo.png" alt="SubFox Logo" className="h-10 w-10 rounded-xl shadow-sm" />
                    <span className="text-xl font-bold tracking-tight text-primary">SubFox</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between border-b border-border bg-card p-4 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="SubFox" className="h-8 w-8 rounded-lg" />
                    <span className="text-xl font-bold">SubFox</span>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="p-2">
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            {/* Mobile Full Screen Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-right md:hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="SubFox" className="h-8 w-8 rounded-lg" />
                            <span className="text-xl font-bold">SubFox</span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 flex flex-col p-6 gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl p-4 text-lg font-medium transition-colors bg-card/50",
                                    location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-6 w-6" />
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="mt-auto flex items-center gap-4 rounded-xl p-4 text-lg font-medium text-destructive transition-colors bg-destructive/10 hover:bg-destructive/20"
                        >
                            <LogOut className="h-6 w-6" />
                            Logout
                        </button>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="mx-auto max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
