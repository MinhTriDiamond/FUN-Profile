import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IconStickerPickerProps {
  onSelect: (icon: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const ICONS = [
  "❤️", "💛", "💚", "💙", "💜", "🧡",
  "💕", "💖", "💗", "💝", "💞", "💓",
  "⭐", "🌟", "✨", "💫", "🌠", "🔥",
  "🎉", "🎊", "🎈", "🎁", "🎀", "🏆",
  "👍", "👏", "🙌", "🤝", "💪", "✌️",
  "😊", "😍", "🥰", "😘", "😂", "🤣",
  "🥳", "😎", "🤩", "🤗", "🤔", "😌",
  "🌸", "🌺", "🌻", "🌹", "🌷", "🌼",
  "🌈", "☀️", "🌙", "⭐", "🌟", "💫",
];

const STICKERS = [
  "🎯", "💎", "🏅", "🎪", "🎭", "🎨",
  "🎬", "🎮", "🎲", "🎰", "🎳", "🎯",
  "⚽", "🏀", "🏈", "⚾", "🎾", "🏐",
  "🍕", "🍔", "🍟", "🌮", "🌯", "🥙",
  "🍩", "🍪", "🎂", "🍰", "🧁", "🍦",
  "☕", "🥤", "🍷", "🍺", "🍻", "🥂",
  "🚗", "🏠", "🌍", "✈️", "🚀", "🎈",
  "📱", "💻", "⌚", "📷", "🎥", "📺",
];

const IconStickerPicker = ({ onSelect, children, disabled }: IconStickerPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (icon: string) => {
    onSelect(icon);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <Tabs defaultValue="icons" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="icons" className="mt-3">
            <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
              {ICONS.map((icon, index) => (
                <Button
                  key={`icon-${index}`}
                  variant="ghost"
                  className="h-10 w-10 p-0 hover:bg-accent"
                  onClick={() => handleSelect(icon)}
                >
                  <span className="text-2xl">{icon}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stickers" className="mt-3">
            <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
              {STICKERS.map((sticker, index) => (
                <Button
                  key={`sticker-${index}`}
                  variant="ghost"
                  className="h-10 w-10 p-0 hover:bg-accent"
                  onClick={() => handleSelect(sticker)}
                >
                  <span className="text-2xl">{sticker}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default IconStickerPicker;
