import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Button, Input, Card, Select } from '../components/ui';

const AddSubscription = () => {
    const navigate = useNavigate();
    const { addSubscription } = useSubscriptions();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [recurrence, setRecurrence] = useState<'monthly' | 'bimonthly' | 'quarterly' | 'yearly'>('monthly');
    const [tags, setTags] = useState('');
    const [startDate, setStartDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addSubscription({
            name,
            amount: parseFloat(amount),
            currency,
            recurrence,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            startDate: startDate || new Date().toISOString(),
        });

        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Subscription</h1>
                <p className="text-muted-foreground">Track a new recurring expense.</p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Service Name</label>
                            <Input
                                required
                                placeholder="e.g. Netflix"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <Input
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Currency</label>
                            <Select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Recurrence</label>
                            <Select
                                value={recurrence}
                                onChange={(e) => setRecurrence(e.target.value as any)}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="bimonthly">Bimonthly (Every 2 months)</option>
                                <option value="quarterly">Quarterly (Every 3 months)</option>
                                <option value="yearly">Yearly</option>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <Input
                            placeholder="entertainment, streaming, utility (comma separated)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Separate multiple tags with commas.</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Subscription
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddSubscription;
