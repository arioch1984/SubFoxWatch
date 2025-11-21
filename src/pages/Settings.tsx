import React, { useRef } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Button, Card } from '../components/ui';
import { Download, Upload, AlertTriangle } from 'lucide-react';

const Settings = () => {
    const { subscriptions, importSubscriptions } = useSubscriptions();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(subscriptions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `subfox_backup_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        const { files } = event.target;

        if (files && files.length > 0) {
            fileReader.readAsText(files[0], "UTF-8");
            fileReader.onload = (e) => {
                const content = e.target?.result;
                if (content && typeof content === 'string') {
                    try {
                        const parsedData = JSON.parse(content);
                        if (Array.isArray(parsedData)) {
                            // Import data
                            importSubscriptions(parsedData);
                            alert('Data imported successfully!');
                            // Reset file input
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }
                    } catch (error) {
                        console.error("Error parsing JSON", error);
                        alert('Invalid JSON file');
                    }
                }
            };
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your data and preferences.</p>
            </div>

            <Card className="p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Data Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Your data is stored locally in your browser. Use Export to create a backup file, and Import to restore it.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-medium">
                            <Download className="h-5 w-5 text-primary" />
                            Export Data
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Download a JSON file containing all your subscriptions.
                        </p>
                        <Button onClick={handleExport} variant="outline" className="w-full">
                            Export Backup
                        </Button>
                    </div>

                    <div className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-medium">
                            <Upload className="h-5 w-5 text-primary" />
                            Import Data
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Restore your subscriptions from a backup file.
                        </p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                ref={fileInputRef}
                            />
                            <Button variant="outline" className="w-full">
                                Select File
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Note:</strong> Importing data will merge with your current subscriptions. Duplicate handling is not yet implemented.
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
