import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    recurrence: 'monthly' | 'bimonthly' | 'quarterly' | 'yearly';
    tags: string[];
    startDate: string;
}

interface SubscriptionContextType {
    subscriptions: Subscription[];
    addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
    removeSubscription: (id: string) => void;
    updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
    getTotalMonthly: () => number;
    getTotalYearly: () => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem('subfox_subscriptions');
        if (storedData) {
            try {
                setSubscriptions(JSON.parse(storedData));
            } catch (e) {
                console.error('Failed to parse subscriptions', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('subfox_subscriptions', JSON.stringify(subscriptions));
    }, [subscriptions]);

    const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
        const newSubscription = { ...subscription, id: crypto.randomUUID() };
        setSubscriptions([...subscriptions, newSubscription]);
    };

    const removeSubscription = (id: string) => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    };

    const updateSubscription = (id: string, updated: Partial<Subscription>) => {
        setSubscriptions(subscriptions.map(sub => (sub.id === id ? { ...sub, ...updated } : sub)));
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
        <SubscriptionContext.Provider value={{ subscriptions, addSubscription, removeSubscription, updateSubscription, getTotalMonthly, getTotalYearly }}>
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
