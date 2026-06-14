import { useState } from "react";
import { useJournal, JournalEntry } from "@/contexts/JournalContext";
import { EntryCard } from "@/components/journal/EntryCard";
import { EntryEditor } from "@/components/journal/EntryEditor";
import { FloatingActionButton } from "@/components/journal/FloatingActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Tag,
  TrendingUp,
} from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function Dashboard() {
  const { entries, deleteEntry } = useJournal();
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const recentEntries = entries.slice(0, 3);
  const thisMonthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    return entryDate >= startOfMonth(now) && entryDate <= endOfMonth(now);
  });

  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)));
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 hover:shadow-soft transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Entries
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {entries.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-accent/20 hover:shadow-soft transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {thisMonthEntries.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 hover:shadow-soft transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tags
              </CardTitle>
              <Tag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {allTags.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-accent/20 hover:shadow-soft transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Common Mood
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground capitalize">
                {mostFrequentMood ? mostFrequentMood[0] : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Recent Entries
          </h2>
          {recentEntries.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentEntries.map((entry) => (
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
              <p className="text-muted-foreground mb-4">
                No entries yet. Start writing!
              </p>
            </Card>
          )}
        </div>
      </div>

      <FloatingActionButton
        onClick={() => {
          setEditingEntry(null);
          setShowEditor(true);
        }}
      />

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
