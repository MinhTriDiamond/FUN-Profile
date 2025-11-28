import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaFile {
  file?: File;
  preview: string;
  type: "image" | "video";
}

interface MediaGridProps {
  mediaFiles: MediaFile[];
  onRemove?: (index: number) => void;
  disabled?: boolean;
}

const MediaGrid = ({ mediaFiles, onRemove, disabled }: MediaGridProps) => {
  const count = mediaFiles.length;

  // Grid layout logic similar to Facebook
  const getGridClass = () => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2";
    if (count === 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const getItemClass = (index: number) => {
    if (count === 1) return "col-span-1 row-span-1 aspect-[16/9]";
    if (count === 2) return "col-span-1 row-span-1 aspect-square";
    if (count === 3) {
      if (index === 0) return "col-span-2 row-span-2 aspect-square";
      return "col-span-1 row-span-1 aspect-square";
    }
    if (count === 4) return "col-span-1 row-span-1 aspect-square";
    if (count === 5) {
      if (index < 2) return "col-span-1 row-span-1 aspect-square";
      return "col-span-1 row-span-1 aspect-square";
    }
    return "col-span-1 row-span-1 aspect-square";
  };

  return (
    <div className={`grid ${getGridClass()} gap-2 rounded-lg overflow-hidden`}>
      {mediaFiles.slice(0, 9).map((media, index) => (
        <div
          key={index}
          className={`relative ${getItemClass(index)} bg-muted overflow-hidden rounded-lg group`}
        >
          {media.type === "image" ? (
            <img
              src={media.preview}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={media.preview}
              className="w-full h-full object-cover"
              controls={false}
            />
          )}
          
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Show +N overlay for more than 9 items */}
          {index === 8 && mediaFiles.length > 9 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <p className="text-white text-3xl font-bold">+{mediaFiles.length - 9}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
