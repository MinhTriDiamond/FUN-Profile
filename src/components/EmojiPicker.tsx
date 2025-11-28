import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface EmojiOption {
  emoji: string;
  text: string;
}

const FEELINGS: EmojiOption[] = [
  { emoji: "😊", text: "happy" },
  { emoji: "😍", text: "loved" },
  { emoji: "😂", text: "laughing" },
  { emoji: "😎", text: "cool" },
  { emoji: "🥳", text: "celebrating" },
  { emoji: "😴", text: "sleepy" },
  { emoji: "😋", text: "hungry" },
  { emoji: "🤔", text: "thoughtful" },
  { emoji: "😌", text: "blessed" },
  { emoji: "🔥", text: "on fire" },
  { emoji: "💪", text: "motivated" },
  { emoji: "🎉", text: "excited" },
  { emoji: "❤️", text: "in love" },
  { emoji: "😢", text: "sad" },
  { emoji: "😤", text: "frustrated" },
  { emoji: "🤯", text: "mind blown" },
];

interface EmojiPickerProps {
  onSelect: (feeling: { emoji: string; text: string } | null) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const EmojiPicker = ({ onSelect, children, disabled }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (feeling: EmojiOption) => {
    onSelect(feeling);
    setOpen(false);
  };

  const handleRemove = () => {
    onSelect(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">How are you feeling?</h3>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FEELINGS.map((feeling) => (
              <Button
                key={feeling.text}
                variant="ghost"
                className="flex flex-col h-auto p-3 hover:bg-accent"
                onClick={() => handleSelect(feeling)}
              >
                <span className="text-2xl mb-1">{feeling.emoji}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {feeling.text}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
