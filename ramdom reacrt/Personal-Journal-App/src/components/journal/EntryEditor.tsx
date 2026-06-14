import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useJournal, JournalEntry } from "@/contexts/JournalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoodPicker } from "./MoodPicker";
import { TagInput } from "./TagInput";
import { toast } from "sonner";

interface EntryEditorProps {
  entry?: JournalEntry | null;
  onClose: () => void;
}

export const EntryEditor = ({ entry, onClose }: EntryEditorProps) => {
  const { addEntry, updateEntry } = useJournal();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("happy");
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setTags(entry.tags);
      setDate(new Date(entry.date).toISOString().split("T")[0]);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const entryData = {
      title: title.trim(),
      content: content.trim(),
      mood,
      tags,
      date: new Date(date),
      aiSummary: undefined, // Clear the AI summary when entry is updated
    };

    if (entry) {
      updateEntry(entry.id, entryData);
      toast.success("Entry updated successfully!");
    } else {
      addEntry(entryData);
      toast.success("Entry created successfully!");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-elevated max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto animate-scale-in">
        <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {entry ? "Edit Entry" : "New Entry"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-card"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              type="text"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-card text-lg"
            />
          </div>

          <MoodPicker selectedMood={mood} onMoodChange={setMood} />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Content
            </label>
            <Textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] bg-card resize-none"
            />
          </div>

          <TagInput tags={tags} onTagsChange={setTags} />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              {entry ? "Update Entry" : "Save Entry"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
