import https from 'https';

const brands = [
    { name: 'Netflix', slug: 'netflix', color: '#E50914' },
    { name: 'Spotify', slug: 'spotify', color: '#1DB954' },
    { name: 'YouTube', slug: 'youtube', color: '#FF0000' },
    { name: 'YouTube Premium', slug: 'youtube', color: '#FF0000' },
    { name: 'Amazon Prime', slug: 'amazonprime', color: '#00A8E1' },
    { name: 'Disney+', slug: 'disneyplus', color: '#113CCF' },
    { name: 'Apple TV+', slug: 'appletv', color: '#000000' },
    { name: 'Apple Music', slug: 'applemusic', color: '#FA243C' },
    { name: 'Hulu', slug: 'hulu', color: '#1CE783' },
    { name: 'HBO Max', slug: 'hbo', color: '#380085' },
    { name: 'Twitch', slug: 'twitch', color: '#9146FF' },
    { name: 'SoundCloud', slug: 'soundcloud', color: '#FF3300' },
    { name: 'Audible', slug: 'audible', color: '#F8991C' },
    { name: 'Crunchyroll', slug: 'crunchyroll', color: '#F47521' },
    { name: 'Paramount+', slug: 'paramountplus', color: '#0064FF' },
    { name: 'ChatGPT', slug: 'openai', color: '#412991' },
    { name: 'Claude', slug: 'anthropic', color: '#D97757' },
    { name: 'Midjourney', slug: 'midjourney', color: '#FFFFFF' },
    { name: 'GitHub', slug: 'github', color: '#181717' },
    { name: 'GitLab', slug: 'gitlab', color: '#FC6D26' },
    { name: 'Vercel', slug: 'vercel', color: '#000000' },
    { name: 'Netlify', slug: 'netlify', color: '#00C7B7' },
    { name: 'Heroku', slug: 'heroku', color: '#430098' },
    { name: 'AWS', slug: 'amazonaws', color: '#232F3E' },
    { name: 'Google Cloud', slug: 'googlecloud', color: '#4285F4' },
    { name: 'Azure', slug: 'microsoftazure', color: '#0078D4' },
    { name: 'DigitalOcean', slug: 'digitalocean', color: '#0080FF' },
    { name: 'Docker', slug: 'docker', color: '#2496ED' },
    { name: 'Figma', slug: 'figma', color: '#F24E1E' },
    { name: 'Adobe Creative Cloud', slug: 'adobecreativecloud', color: '#DA1F26' },
    { name: 'Canva', slug: 'canva', color: '#00C4CC' },
    { name: 'Notion', slug: 'notion', color: '#000000' },
    { name: 'Trello', slug: 'trello', color: '#0052CC' },
    { name: 'Asana', slug: 'asana', color: '#273347' },
    { name: 'Slack', slug: 'slack', color: '#4A154B' },
    { name: 'Zoom', slug: 'zoom', color: '#2D8CFF' },
    { name: 'Microsoft Teams', slug: 'microsoftteams', color: '#6264A7' },
    { name: 'Discord', slug: 'discord', color: '#5865F2' },
    { name: 'Dropbox', slug: 'dropbox', color: '#0061FF' },
    { name: 'Google Drive', slug: 'googledrive', color: '#4285F4' },
    { name: 'OneDrive', slug: 'microsoftonedrive', color: '#0078D4' },
    { name: 'iCloud', slug: 'icloud', color: '#3693F3' },
    { name: '1Password', slug: '1password', color: '#0094F5' },
    { name: 'LastPass', slug: 'lastpass', color: '#D32D27' },
    { name: 'NordVPN', slug: 'nordvpn', color: '#4687FF' },
    { name: 'ExpressVPN', slug: 'expressvpn', color: '#C41230' },
    { name: 'Steam', slug: 'steam', color: '#000000' },
    { name: 'PlayStation', slug: 'playstation', color: '#003791' },
    { name: 'Xbox', slug: 'xbox', color: '#107C10' },
    { name: 'Nintendo', slug: 'nintendo', color: '#E60012' },
    { name: 'Epic Games', slug: 'epicgames', color: '#313131' },
    { name: 'Ubisoft', slug: 'ubisoft', color: '#0091DA' },
    { name: 'EA Play', slug: 'ea', color: '#FF4747' },
    { name: 'Game Pass', slug: 'xbox', color: '#107C10' },
    { name: 'X (Twitter)', slug: 'x', color: '#000000' },
    { name: 'LinkedIn', slug: 'linkedin', color: '#0A66C2' },
    { name: 'Medium', slug: 'medium', color: '#000000' },
    { name: 'Patreon', slug: 'patreon', color: '#FF424D' },
    { name: 'OnlyFans', slug: 'onlyfans', color: '#00AFF0' },
    { name: 'Tinder', slug: 'tinder', color: '#FE3C72' },
    { name: 'Bumble', slug: 'bumble', color: '#FFC629' },
    { name: 'Hinge', slug: 'hinge', color: '#000000' },
    { name: 'Duolingo', slug: 'duolingo', color: '#58CC02' },
    { name: 'Fitbit', slug: 'fitbit', color: '#00B0B9' },
    { name: 'Strava', slug: 'strava', color: '#FC4C02' },
];

async function checkSlug(slug) {
    return new Promise((resolve) => {
        const url = `https://cdn.simpleicons.org/${slug}`;
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            if (res.statusCode === 200) {
                resolve({ slug, status: 'OK' });
            } else {
                resolve({ slug, status: 'FAIL', code: res.statusCode });
            }
        });
        req.on('error', (e) => {
            resolve({ slug, status: 'ERROR', error: e.message });
        });
        req.end();
    });
}

async function main() {
    console.log('Checking icon slugs...');

    for (const brand of brands) {
        // Generate variations
        const name = brand.name.toLowerCase();
        const variations = [
            brand.slug,
            name.replace(/[^a-z0-9]/g, ''), // amazonprime
            name.replace(/[^a-z0-9]/g, '-'), // amazon-prime
            name.split(' ')[0], // amazon
            brand.slug.replace('microsoft', ''), // azure (from microsoftazure)
            `microsoft${brand.slug}`, // microsoftazure
        ];

        // Remove duplicates
        const uniqueVariations = [...new Set(variations)];

        let found = false;
        for (const v of uniqueVariations) {
            if (!v) continue;
            const result = await checkSlug(v);
            if (result.status === 'OK') {
                if (v !== brand.slug) {
                    console.log(`[FIX] ${brand.name}: ${brand.slug} -> ${v}`);
                } else {
                    // console.log(`[OK] ${brand.name}`);
                }
                found = true;
                break;
            }
        }

        if (!found) {
            console.log(`[FAIL] ${brand.name}: Could not find valid slug. Tried: ${uniqueVariations.join(', ')}`);
        }
    }
}

main();
