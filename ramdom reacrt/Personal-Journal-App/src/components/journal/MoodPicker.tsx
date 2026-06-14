import { cn } from '@/lib/utils';

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '🤗', label: 'Grateful', value: 'grateful' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
];

interface MoodPickerProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

export const MoodPicker = ({ selectedMood, onMoodChange }: MoodPickerProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        How are you feeling?
      </label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onMoodChange(mood.value)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-3 rounded-lg border transition-all duration-200',
              'hover:scale-105 hover:shadow-soft',
              selectedMood === mood.value
                ? 'border-primary bg-primary/10 shadow-soft'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
