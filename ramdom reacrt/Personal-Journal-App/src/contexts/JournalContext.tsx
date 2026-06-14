import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { generateAISummary } from "@/lib/aiSummary";
import { format } from "date-fns";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  aiSummary?: string;
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
  searchEntries: (query: string) => JournalEntry[];
  filterByTags: (tags: string[]) => JournalEntry[];
  filterByMood: (mood: string) => JournalEntry[];
  filterByDateRange: (startDate: Date, endDate: Date) => JournalEntry[];
  exportData: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  generateSummaryForEntry: (id: string) => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournal must be used within JournalProvider");
  }
  return context;
};

interface JournalProviderProps {
  children: ReactNode;
}

export const JournalProvider: React.FC<JournalProviderProps> = ({
  children,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(
        parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }))
      );
    }

    const savedTheme = localStorage.getItem("journalTheme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date() }
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getEntryById = (id: string) => {
    return entries.find((entry) => entry.id === id);
  };

  const searchEntries = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.content.toLowerCase().includes(lowerQuery) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const filterByTags = (tags: string[]) => {
    if (tags.length === 0) return entries;
    return entries.filter((entry) =>
      tags.some((tag) => entry.tags.includes(tag))
    );
  };

  const filterByMood = (mood: string) => {
    return entries.filter((entry) => entry.mood === mood);
  };

  const filterByDateRange = (startDate: Date, endDate: Date) => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `journal-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("journalTheme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const generateSummaryForEntry = async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) {
      console.error("Entry not found:", id);
      return;
    }

    console.log("📝 Generating summary for entry:", {
      id: entry.id,
      title: entry.title,
      mood: entry.mood,
      tags: entry.tags,
      contentLength: entry.content.length,
    });

    try {
      // Send only the content for summarization
      const summary = await generateAISummary(entry.content);
      console.log("✅ Summary generated:", summary);
      updateEntry(id, { aiSummary: summary });
    } catch (error) {
      console.error("Failed to generate summary:", error);
      throw error;
    }
  };

  const value: JournalContextType = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    searchEntries,
    filterByTags,
    filterByMood,
    filterByDateRange,
    exportData,
    theme,
    toggleTheme,
    generateSummaryForEntry,
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};
