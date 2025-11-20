import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/add', icon: PlusCircle, label: 'Add Subscription' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
                <div className="mb-8 flex items-center gap-2 px-2">
                    <div className="h-8 w-8 rounded-full bg-primary" />
                    <span className="text-xl font-bold tracking-tight">SubFox</span>
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
            <header className="md:hidden flex items-center justify-between border-b border-border bg-card p-4">
                <span className="text-xl font-bold">SubFox</span>
                <button onClick={handleLogout} className="p-2">
                    <LogOut className="h-5 w-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="mx-auto max-w-5xl">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card flex justify-around p-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                            location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
