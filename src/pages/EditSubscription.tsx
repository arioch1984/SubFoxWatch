import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Button, Input, Card, Select } from '../components/ui';
import { IconPicker, POPULAR_BRANDS } from '../components/IconPicker';

const EditSubscription = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { subscriptions, updateSubscription } = useSubscriptions();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [icon, setIcon] = useState('');
    const [recurrence, setRecurrence] = useState<'monthly' | 'bimonthly' | 'quarterly' | 'yearly'>('monthly');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (id) {
            const sub = subscriptions.find(s => s.id === id);
            if (sub) {
                setName(sub.name);
                setAmount(sub.amount.toString());
                setCurrency(sub.currency);
                setIcon(sub.icon || '');
                setRecurrence(sub.recurrence);
                setTags(sub.tags.join(', '));
            } else {
                // Subscription not found, redirect to dashboard
                navigate('/');
            }
        }
    }, [id, subscriptions, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (id) {
            updateSubscription(id, {
                name,
                icon,
                amount: parseFloat(amount),
                currency,
                recurrence,
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
            });
            navigate('/');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Subscription</h1>
                    <p className="text-muted-foreground">Modify your subscription details.</p>
                </div>
                <img
                    src="/mascot-peeking.png"
                    alt="Peeking Fox"
                    className="h-24 w-auto -mb-4 transform translate-y-2"
                />
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
                                onChange={(e) => {
                                    const newName = e.target.value;
                                    setName(newName);
                                    // Only auto-detect if icon is empty to avoid overwriting user choice
                                    if (!icon) {
                                        const brand = POPULAR_BRANDS.find(b => newName.toLowerCase().includes(b.name.toLowerCase()));
                                        if (brand) {
                                            setIcon(`brand:${brand.slug}`);
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Icon</label>
                            <IconPicker value={icon} onChange={setIcon} />
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
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditSubscription;
