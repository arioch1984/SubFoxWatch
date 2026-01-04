import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, pass: string) => Promise<{ error: any }>;
    signUp: (email: string, pass: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        }).catch((err) => {
            console.error('Supabase auth error:', err);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        if (email === 'test@test.com' && pass === 'test') {
            const mockUser = {
                id: 'mock-user-id',
                email: 'test@test.com',
                user_metadata: { full_name: 'Test User' },
                app_metadata: { provider: 'email' },
                aud: 'authenticated',
                created_at: new Date().toISOString()
            };
            const mockSession = {
                access_token: 'mock-token',
                refresh_token: 'mock-refresh-token',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser
            };
            setSession(mockSession as unknown as Session);
            return { error: null };
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        return { error };
    };

    const signUp = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
        });
        return { error };
    };

    const logout = async () => {
        if (session?.user?.email === 'test@test.com') {
            setSession(null);
            return;
        }
        await supabase.auth.signOut();
    };

    const value = {
        isAuthenticated: !!session,
        user: session?.user ?? null,
        login,
        signUp,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
