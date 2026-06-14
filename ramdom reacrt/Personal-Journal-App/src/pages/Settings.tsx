import { useJournal } from '@/contexts/JournalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Download, Moon, Sun, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, toggleTheme, exportData, entries } = useJournal();

  const handleExport = () => {
    exportData();
    toast.success('Journal data exported successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all entries? This cannot be undone.')) {
      localStorage.removeItem('journalEntries');
      window.location.reload();
      toast.success('All entries have been deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Settings
        </h1>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how your journal looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export or manage your journal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  You have {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in your journal
                </p>
                <Button
                  onClick={handleExport}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Journal Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your journal entries. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Entries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
