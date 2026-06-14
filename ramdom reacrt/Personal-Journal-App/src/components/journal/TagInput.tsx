import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const tagColors = [
  'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  'bg-green-500/20 text-green-700 dark:text-green-300',
  'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  'bg-orange-500/20 text-orange-700 dark:text-orange-300',
  'bg-pink-500/20 text-pink-700 dark:text-pink-300',
];

export const TagInput = ({ tags, onTagsChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Tags
      </label>
      <Input
        type="text"
        placeholder="Type a tag and press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-card"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={tag}
              className={`${getTagColor(index)} px-3 py-1 flex items-center gap-1 animate-scale-in`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
