import React, { useState, useEffect } from 'react';
import {
    Search,
    Globe,
    Tv,
    Music,
    Gamepad2,
    ShoppingCart,
    Home,
    Zap,
    Briefcase,
    GraduationCap,
    Dumbbell,
    Car,
    Smartphone,
    Cloud,
    Shield,
    MoreHorizontal
} from 'lucide-react';
import { Input } from './ui';
import { cn } from '../lib/utils';

// Common brands for auto-detection and quick selection
export const POPULAR_BRANDS = [
    // Streaming & Entertainment
    { name: 'Netflix', slug: 'netflix', color: '#E50914' },
    { name: 'Spotify', slug: 'spotify', color: '#1DB954' },
    { name: 'YouTube', slug: 'youtube', color: '#FF0000' },
    { name: 'YouTube Premium', slug: 'youtube', color: '#FF0000' },
    { name: 'HBO Max', slug: 'hbomax', color: '#380085' },
    { name: 'Twitch', slug: 'twitch', color: '#9146FF' },
    { name: 'SoundCloud', slug: 'soundcloud', color: '#FF3300' },
    { name: 'Audible', slug: 'audible', color: '#F8991C' },
    { name: 'Crunchyroll', slug: 'crunchyroll', color: '#F47521' },

    // Productivity & Tools
    { name: 'ChatGPT', slug: 'openai', color: '#412991' },
    { name: 'Claude', slug: 'anthropic', color: '#D97757' },
    { name: 'GitHub', slug: 'github', color: '#181717' },
    { name: 'GitLab', slug: 'gitlab', color: '#FC6D26' },
    { name: 'Vercel', slug: 'vercel', color: '#000000' },
    { name: 'Netlify', slug: 'netlify', color: '#00C7B7' },
    { name: 'Heroku', slug: 'heroku', color: '#430098' },
    { name: 'Google Cloud', slug: 'googlecloud', color: '#4285F4' },
    { name: 'DigitalOcean', slug: 'digitalocean', color: '#0080FF' },
    { name: 'Docker', slug: 'docker', color: '#2496ED' },
    { name: 'Figma', slug: 'figma', color: '#F24E1E' },
    { name: 'Canva', slug: 'canva', color: '#00C4CC' },
    { name: 'Notion', slug: 'notion', color: '#000000' },
    { name: 'Trello', slug: 'trello', color: '#0052CC' },
    { name: 'Asana', slug: 'asana', color: '#273347' },
    { name: 'Slack', slug: 'slack', color: '#4A154B' },
    { name: 'Zoom', slug: 'zoom', color: '#2D8CFF' },
    { name: 'Discord', slug: 'discord', color: '#5865F2' },

    // Storage & Utilities
    { name: 'Dropbox', slug: 'dropbox', color: '#0061FF' },
    { name: 'Google Drive', slug: 'googledrive', color: '#4285F4' },
    { name: 'iCloud', slug: 'icloud', color: '#3693F3' },
    { name: '1Password', slug: '1password', color: '#0094F5' },
    { name: 'LastPass', slug: 'lastpass', color: '#D32D27' },
    { name: 'NordVPN', slug: 'nordvpn', color: '#4687FF' },
    { name: 'ExpressVPN', slug: 'expressvpn', color: '#C41230' },

    // Gaming
    { name: 'Steam', slug: 'steam', color: '#000000' },
    { name: 'PlayStation', slug: 'playstation', color: '#003791' },
    { name: 'Epic Games', slug: 'epicgames', color: '#313131' },
    { name: 'Ubisoft', slug: 'ubisoft', color: '#0091DA' },
    { name: 'EA Play', slug: 'ea', color: '#FF4747' },

    // Social & Other
    { name: 'X (Twitter)', slug: 'x', color: '#000000' },
    { name: 'Medium', slug: 'medium', color: '#000000' },
    { name: 'Patreon', slug: 'patreon', color: '#FF424D' },
    { name: 'OnlyFans', slug: 'onlyfans', color: '#00AFF0' },
    { name: 'Tinder', slug: 'tinder', color: '#FE3C72' },
    { name: 'Duolingo', slug: 'duolingo', color: '#58CC02' },
    { name: 'Fitbit', slug: 'fitbit', color: '#00B0B9' },
    { name: 'Strava', slug: 'strava', color: '#FC4C02' },
];

// Generic icons mapping
export const GENERIC_ICONS = [
    { name: 'General', icon: Globe },
    { name: 'Entertainment', icon: Tv },
    { name: 'Music', icon: Music },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Shopping', icon: ShoppingCart },
    { name: 'Home', icon: Home },
    { name: 'Utilities', icon: Zap },
    { name: 'Work', icon: Briefcase },
    { name: 'Education', icon: GraduationCap },
    { name: 'Health', icon: Dumbbell },
    { name: 'Transport', icon: Car },
    { name: 'Mobile', icon: Smartphone },
    { name: 'Cloud', icon: Cloud },
    { name: 'Security', icon: Shield },
    { name: 'Other', icon: MoreHorizontal },
];

interface IconPickerProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedIcon = value ? parseIconValue(value) : null;

    // Close on click outside (simple implementation)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && !(e.target as Element).closest('.icon-picker-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const filteredBrands = POPULAR_BRANDS.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={cn("relative icon-picker-container", className)}>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-10 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    {selectedIcon ? (
                        <IconDisplay icon={value} className="h-6 w-6" />
                    ) : (
                        <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
                {isOpen && (
                    <div className="absolute top-12 left-0 z-50 w-[300px] p-2 rounded-lg border bg-popover shadow-md animate-in fade-in zoom-in-95 duration-200">
                        <Input
                            placeholder="Search icons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                            autoFocus
                        />

                        <div className="max-h-[300px] overflow-y-auto space-y-4">
                            {/* Generic Icons */}
                            {!searchTerm && (
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">Categories</h4>
                                    <div className="grid grid-cols-5 gap-1">
                                        {GENERIC_ICONS.map((item) => (
                                            <button
                                                key={item.name}
                                                type="button"
                                                onClick={() => {
                                                    onChange(`generic:${item.name}`);
                                                    setIsOpen(false);
                                                }}
                                                className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent transition-colors gap-1"
                                                title={item.name}
                                            >
                                                <item.icon className="h-5 w-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Brand Icons */}
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">Brands</h4>
                                <div className="grid grid-cols-5 gap-1">
                                    {filteredBrands.map((brand) => (
                                        <button
                                            key={brand.slug}
                                            type="button"
                                            onClick={() => {
                                                onChange(`brand:${brand.slug}`);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                                            title={brand.name}
                                        >
                                            <img
                                                src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color.replace('#', '')}`}
                                                alt={brand.name}
                                                className="h-5 w-5"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const IconDisplay: React.FC<{ icon?: string; className?: string }> = ({ icon, className }) => {
    if (!icon) return <div className={cn("bg-muted rounded-full", className)} />;

    const { type, value } = parseIconValue(icon);

    if (type === 'brand') {
        return (
            <img
                src={`https://cdn.simpleicons.org/${value}`}
                alt={value}
                className={cn("object-contain", className)}
                onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        );
    }

    if (type === 'generic') {
        const IconComponent = GENERIC_ICONS.find(i => i.name === value)?.icon || Globe;
        return <IconComponent className={className} />;
    }

    return <Globe className={className} />;
};

function parseIconValue(value: string) {
    const [type, ...rest] = value.split(':');
    return { type, value: rest.join(':') };
}
