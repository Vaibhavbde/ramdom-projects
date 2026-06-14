import { useState } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { EntryCard } from '@/components/journal/EntryCard';
import { EntryEditor } from '@/components/journal/EntryEditor';
import { FloatingActionButton } from '@/components/journal/FloatingActionButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Entries() {
  const { entries, searchEntries, filterByTags, deleteEntry } = useJournal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  const filteredEntries = (() => {
    let result = entries;
    
    if (searchQuery) {
      result = searchEntries(searchQuery);
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(entry =>
        selectedTags.some(tag => entry.tags.includes(tag))
      );
    }
    
    return result;
  })();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const tagColors = [
    'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    'bg-green-500/20 text-green-700 dark:text-green-300',
    'bg-purple-500/20 text-purple-700 dark:text-purple-300',
    'bg-orange-500/20 text-orange-700 dark:text-orange-300',
    'bg-pink-500/20 text-pink-700 dark:text-pink-300',
  ];

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          All Entries
        </h1>

        <Card className="p-6 bg-gradient-to-br from-card to-card/80 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search entries by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="h-4 w-4" />
                <span>Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <Badge
                    key={tag}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedTags.includes(tag)
                        ? getTagColor(index)
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div>
          <p className="text-muted-foreground mb-6">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEntries.map(entry => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={(entry) => {
                    setEditingEntry(entry);
                    setShowEditor(true);
                  }}
                  onDelete={deleteEntry}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-gradient-to-br from-card to-card/80">
              <p className="text-muted-foreground">
                {searchQuery || selectedTags.length > 0
                  ? 'No entries match your search criteria'
                  : 'No entries yet. Start writing!'}
              </p>
            </Card>
          )}
        </div>
      </div>

      <FloatingActionButton onClick={() => {
        setEditingEntry(null);
        setShowEditor(true);
      }} />

      {showEditor && (
        <EntryEditor
          entry={editingEntry}
          onClose={() => {
            setShowEditor(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
}
