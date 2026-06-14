import { useState } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { EntryEditor } from '@/components/journal/EntryEditor';
import { FloatingActionButton } from '@/components/journal/FloatingActionButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

export default function CalendarView() {
  const { entries } = useJournal();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => isSameDay(new Date(entry.date), date));
  };

  const hasEntries = (date: Date) => {
    return getEntriesForDate(date).length > 0;
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    sad: '😔',
    frustrated: '😤',
    tired: '😴',
    grateful: '🤗',
    anxious: '😰',
    excited: '🤩',
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Calendar
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base sm:text-xl font-semibold text-foreground min-w-[160px] sm:min-w-[200px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <Card className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-card to-card/80">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs sm:text-sm font-semibold text-muted-foreground py-1 sm:py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map(date => {
                  const dateEntries = getEntriesForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'aspect-square p-1 sm:p-2 rounded-lg transition-all duration-200 hover:scale-105',
                        'flex flex-col items-center justify-center gap-0.5 sm:gap-1',
                        isSelected && 'bg-primary text-primary-foreground shadow-soft',
                        !isSelected && hasEntries(date) && 'bg-accent/20 hover:bg-accent/30',
                        !isSelected && !hasEntries(date) && 'hover:bg-secondary',
                        isToday && !isSelected && 'ring-1 sm:ring-2 ring-primary'
                      )}
                    >
                      <span className={cn(
                        'text-xs sm:text-sm font-medium',
                        isSelected && 'text-primary-foreground',
                        !isSelected && 'text-foreground'
                      )}>
                        {format(date, 'd')}
                      </span>
                      {dateEntries.length > 0 && (
                        <div className="flex gap-0.5">
                          {dateEntries.slice(0, 3).map((entry, i) => (
                            <span key={i} className="text-xs">
                              {moodEmojis[entry.mood]}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              {selectedDateEntries.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEntries.map(entry => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setEditingEntry(entry);
                        setShowEditor(true);
                      }}
                      className="w-full text-left p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{moodEmojis[entry.mood]}</span>
                        <span className="font-medium text-foreground">{entry.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedDate
                    ? 'No entries for this date'
                    : 'Click on a date to view entries'}
                </p>
              )}
            </Card>
          </div>
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
