import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    recurrence: 'monthly' | 'bimonthly' | 'quarterly' | 'yearly';
    tags: string[];
    icon?: string;
    user_id?: string;
}

interface SubscriptionContextType {
    subscriptions: Subscription[];
    addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
    removeSubscription: (id: string) => Promise<void>;
    updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;
    importSubscriptions: (subscriptions: Subscription[]) => Promise<void>;
    getTotalMonthly: () => number;
    getTotalYearly: () => number;
    loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchSubscriptions();
        } else {
            setSubscriptions([]);
            setLoading(false);
        }
    }, [user]);

    const fetchSubscriptions = async () => {
        try {
            if (user?.email === 'test@test.com') {
                const stored = localStorage.getItem('subfoxwatch_subscriptions');
                if (stored) {
                    setSubscriptions(JSON.parse(stored));
                }
                return;
            }

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*');

            if (error) throw error;
            setSubscriptions(data || []);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
        if (!user) return;
        try {
            if (user.email === 'test@test.com') {
                const newSub = { ...subscription, id: crypto.randomUUID(), user_id: 'mock-user-id' };
                const newSubscriptions = [...subscriptions, newSub];
                setSubscriptions(newSubscriptions);
                localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(newSubscriptions));
                return;
            }

            const { data, error } = await supabase
                .from('subscriptions')
                .insert([{ ...subscription, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            setSubscriptions([...subscriptions, data]);
        } catch (error) {
            console.error('Error adding subscription:', error);
        }
    };

    const removeSubscription = async (id: string) => {
        try {
            if (user?.email === 'test@test.com') {
                const newSubscriptions = subscriptions.filter(sub => sub.id !== id);
                setSubscriptions(newSubscriptions);
                localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(newSubscriptions));
                return;
            }

            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        } catch (error) {
            console.error('Error removing subscription:', error);
        }
    };

    const updateSubscription = async (id: string, updated: Partial<Subscription>) => {
        try {
            if (user?.email === 'test@test.com') {
                const newSubscriptions = subscriptions.map(sub => (sub.id === id ? { ...sub, ...updated } : sub));
                setSubscriptions(newSubscriptions);
                localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(newSubscriptions));
                return;
            }

            const { error } = await supabase
                .from('subscriptions')
                .update(updated)
                .eq('id', id);

            if (error) throw error;
            setSubscriptions(subscriptions.map(sub => (sub.id === id ? { ...sub, ...updated } : sub)));
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };

    const importSubscriptions = async (newSubscriptions: Subscription[]) => {
        if (!user) return;
        try {
            if (user.email === 'test@test.com') {
                const subscriptionsToInsert = newSubscriptions.map(sub => {
                    const { id, ...rest } = sub;
                    return { ...rest, id: crypto.randomUUID(), user_id: 'mock-user-id' } as Subscription;
                });
                const combinedSubscriptions = [...subscriptions, ...subscriptionsToInsert];
                setSubscriptions(combinedSubscriptions);
                localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(combinedSubscriptions));
                return;
            }

            const subscriptionsToInsert = newSubscriptions.map(sub => {
                const { id, ...rest } = sub;
                return { ...rest, user_id: user.id };
            });

            const { data, error } = await supabase
                .from('subscriptions')
                .insert(subscriptionsToInsert)
                .select();

            if (error) throw error;
            setSubscriptions([...subscriptions, ...(data || [])]);
        } catch (error) {
            console.error('Error importing subscriptions:', error);
        }
    };

    const getMonthlyAmount = (sub: Subscription) => {
        switch (sub.recurrence) {
            case 'monthly': return sub.amount;
            case 'bimonthly': return sub.amount / 2;
            case 'quarterly': return sub.amount / 3;
            case 'yearly': return sub.amount / 12;
            default: return sub.amount;
        }
    };

    const getTotalMonthly = () => {
        return subscriptions.reduce((acc, sub) => acc + getMonthlyAmount(sub), 0);
    };

    const getTotalYearly = () => {
        return getTotalMonthly() * 12;
    };

    return (
        <SubscriptionContext.Provider value={{ subscriptions, addSubscription, removeSubscription, updateSubscription, importSubscriptions, getTotalMonthly, getTotalYearly, loading }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscriptions = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscriptions must be used within a SubscriptionProvider');
    }
    return context;
};
