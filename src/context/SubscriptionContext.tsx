import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

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
        // Always load from local storage first for immediate UI
        const stored = localStorage.getItem('subfoxwatch_subscriptions');
        if (stored) {
            setSubscriptions(JSON.parse(stored));
        }

        // Then try to sync with Supabase
        try {
            if (user?.email === 'test@test.com') {
                return;
            }

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*');

            if (error) throw error;

            // Update local storage with fresh data from server
            if (data) {
                setSubscriptions(data);
                localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast.error('Failed to sync with server. showing local data.');
        } finally {
            setLoading(false);
        }
    };

    const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
        if (!user) return;

        // Optimistic update
        const tempId = crypto.randomUUID();
        const optimisticSub = { ...subscription, id: tempId, user_id: user.id } as Subscription;

        const newSubscriptions = [...subscriptions, optimisticSub];
        setSubscriptions(newSubscriptions);
        localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(newSubscriptions));

        try {
            if (user.email === 'test@test.com') {
                toast.success('Subscription saved locally (Test Mode)');
                return;
            }

            const { data, error } = await supabase
                .from('subscriptions')
                .insert([{ ...subscription, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic sub with real one
            const finalSubscriptions = newSubscriptions.map(sub => sub.id === tempId ? data : sub);
            setSubscriptions(finalSubscriptions);
            localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(finalSubscriptions));
            toast.success('Subscription saved successfully');
        } catch (error) {
            console.error('Error adding subscription:', error);
            toast.error('Failed to save to cloud. Saved locally only.');
            // We keep the optimistic update as it is already saved locally
        }
    };

    const removeSubscription = async (id: string) => {
        // Optimistic update
        const newSubscriptions = subscriptions.filter(sub => sub.id !== id);

        setSubscriptions(newSubscriptions);
        localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(newSubscriptions));

        try {
            if (user?.email === 'test@test.com') {
                return;
            }

            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Subscription removed');
        } catch (error) {
            console.error('Error removing subscription:', error);
            toast.error('Failed to sync deletion with cloud.');
            // Optionally revert? For now, we keep local state user intention.
        }
    };

    const updateSubscription = async (id: string, updated: Partial<Subscription>) => {
        // Optimistic update
        const newSubscriptions = subscriptions.map(sub => (sub.id === id ? { ...sub, ...updated } : sub));

        setSubscriptions(newSubscriptions);
        localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(newSubscriptions));

        try {
            if (user?.email === 'test@test.com') {
                return;
            }

            const { error } = await supabase
                .from('subscriptions')
                .update(updated)
                .eq('id', id);

            if (error) throw error;
            toast.success('Subscription updated');
        } catch (error) {
            console.error('Error updating subscription:', error);
            toast.error('Failed to sync update with cloud.');
        }
    };

    const importSubscriptions = async (newSubscriptions: Subscription[]) => {
        if (!user) return;

        // Optimistic update
        const subscriptionsToInsert = newSubscriptions.map(sub => {
            const { id, ...rest } = sub;
            return { ...rest, id: crypto.randomUUID(), user_id: user.id } as Subscription;
        });

        const combinedSubscriptions = [...subscriptions, ...subscriptionsToInsert];
        setSubscriptions(combinedSubscriptions);
        localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(combinedSubscriptions));

        try {
            if (user.email === 'test@test.com') {
                toast.success('Imported locally (Test Mode)');
                return;
            }

            const payload = newSubscriptions.map(sub => {
                const { id, ...rest } = sub;
                return { ...rest, user_id: user.id };
            });

            const { data, error } = await supabase
                .from('subscriptions')
                .insert(payload)
                .select();

            if (error) throw error;

            // Merge server data
            // Since we generated RANDOM UUIDs for local optimistic, and server returns REAL UUIDs,
            // bridging them is tricky without complex logic. 
            // For import, simpler strategy: refresh from server or append server results.
            // But we want to avoid duplicates.
            // Simplified approach: Re-fetch all or just trust the local for a moment, but ideally we replace the optimistic ones.
            // Given complexity, for IMPORT we might just accept the server result is better.

            if (data) {
                // We keep the other existing subs, and append the NEW server subs, removing the optimistic ones we just added.
                // This is getting complicated. 
                // Let's stick to: We added them locally. Now we add them to server. Server returns them.
                // We replace the last N items? No.
                // Let's just Fetch All again to be safe and consistent.
                const { data: allData } = await supabase.from('subscriptions').select('*');
                if (allData) {
                    setSubscriptions(allData);
                    localStorage.setItem('subfoxwatch_subscriptions', JSON.stringify(allData));
                }
            }
            toast.success('Subscriptions imported successfully');
        } catch (error) {
            console.error('Error importing subscriptions:', error);
            toast.error('Failed to import to cloud. Saved locally.');
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
