import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Lock, User } from 'lucide-react';
import mascotImage from '../assets/images/mascotte.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await login(username, password);
            if (error) throw error;
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md p-8 space-y-6 border-border/50 bg-card/50 backdrop-blur-xl">
                <div className="space-y-2 text-center">
                    <div className="flex justify-center mb-4">
                        <img src={mascotImage} alt="SubFox Mascot" className="h-32 w-auto" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        SubFoxWatch
                    </h1>
                    <p className="text-muted-foreground">Enter your credentials to access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
    );
};

// Default export for lazy loading if needed, but standard import for now
export default Login;
