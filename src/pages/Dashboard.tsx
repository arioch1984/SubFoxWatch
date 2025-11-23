import { useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Card } from '../components/ui';
import { IconDisplay } from '../components/IconPicker';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import mascotImage from '../assets/images/mascotte.png';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
    const { subscriptions, getTotalMonthly, getTotalYearly, removeSubscription } = useSubscriptions();

    const monthlyTotal = getTotalMonthly();
    const yearlyTotal = getTotalYearly();

    const expensesByTag = useMemo(() => {
        const data: { [key: string]: number } = {};
        subscriptions.forEach(sub => {
            const monthlyCost = sub.recurrence === 'monthly' ? sub.amount :
                sub.recurrence === 'yearly' ? sub.amount / 12 :
                    sub.recurrence === 'quarterly' ? sub.amount / 3 :
                        sub.recurrence === 'bimonthly' ? sub.amount / 2 : sub.amount;

            sub.tags.forEach(tag => {
                data[tag] = (data[tag] || 0) + monthlyCost;
            });

            if (sub.tags.length === 0) {
                data['Uncategorized'] = (data['Uncategorized'] || 0) + monthlyCost;
            }
        });

        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [subscriptions]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! I'm keeping an eye on your subscriptions.</p>
                </div>
                <img
                    src={mascotImage}
                    alt="Busy Fox"
                    className="absolute right-0 bottom-[-20px] h-40 w-auto opacity-20 md:opacity-100 md:relative md:h-32 md:bottom-0"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Monthly Spend</h3>
                    <div className="mt-2 text-3xl font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(monthlyTotal)}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Yearly Projection</h3>
                    <div className="mt-2 text-3xl font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(yearlyTotal)}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Subscriptions</h3>
                    <div className="mt-2 text-3xl font-bold">{subscriptions.length}</div>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                    <h3 className="mb-4 font-semibold">Expenses by Tag (Monthly)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expensesByTag}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expensesByTag.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value)}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 overflow-hidden">
                    <h3 className="mb-4 font-semibold">Recent Subscriptions</h3>
                    <div className="space-y-4">
                        {subscriptions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No subscriptions added yet.</p>
                        ) : (
                            subscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <IconDisplay icon={sub.icon} className="h-8 w-8 rounded-md" />
                                        <div>
                                            <p className="font-medium">{sub.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{sub.recurrence} • {sub.tags.join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: sub.currency }).format(sub.amount)}
                                        </p>
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                onClick={() => window.location.href = `/edit/${sub.id}`}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => removeSubscription(sub.id)}
                                                className="text-xs text-destructive hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
