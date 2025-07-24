import { Heart, Frown, Zap, Ghost, Flame, Waves } from "lucide-react";
import { Mood } from "@/pages/Index";

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

const moods: Mood[] = [
  {
    id: "happy",
    name: "happy",
    emoji: "😊",
    color: "emotions-happy",
    description: "Feeling joyful and cheerful"
  },
  {
    id: "sad",
    name: "sad", 
    emoji: "😢",
    color: "emotions-sad",
    description: "Feeling down or upset"
  },
  {
    id: "excited",
    name: "excited",
    emoji: "🤩",
    color: "emotions-excited", 
    description: "Full of energy and enthusiasm"
  },
  {
    id: "scared",
    name: "scared",
    emoji: "😰",
    color: "emotions-scared",
    description: "Feeling frightened or worried"
  },
  {
    id: "angry",
    name: "angry",
    emoji: "😠",
    color: "emotions-angry",
    description: "Feeling frustrated or mad"
  },
  {
    id: "calm",
    name: "calm",
    emoji: "😌",
    color: "emotions-calm",
    description: "Feeling peaceful and relaxed"
  }
];

const moodIcons = {
  happy: Heart,
  sad: Frown,
  excited: Zap,
  scared: Ghost,
  angry: Flame,
  calm: Waves
};

const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center mb-6 font-story text-foreground">
        How is your little one feeling today?
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto px-2">
        {moods.map((mood) => {
          const IconComponent = moodIcons[mood.id as keyof typeof moodIcons];
          const isSelected = selectedMood?.id === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(mood)}
              className={`
                relative p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-300 hover:scale-105 
                bg-card hover:shadow-lg group animate-slide-up min-h-[140px] md:min-h-[160px]
                ${isSelected 
                  ? 'border-primary shadow-lg scale-105 bg-gradient-mood' 
                  : 'border-border hover:border-primary/50'
                }
              `}
              style={{ animationDelay: `${moods.indexOf(mood) * 0.1}s` }}
            >
              {/* Mood Emoji */}
              <div className="text-3xl md:text-4xl mb-2 md:mb-3 group-hover:animate-gentle-pulse">
                {mood.emoji}
              </div>
              
              {/* Mood Icon */}
              <IconComponent 
                size={20} 
                className={`mx-auto mb-2 transition-colors ${
                  isSelected ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'
                }`}
              />
              
              {/* Mood Name */}
              <h3 className={`font-semibold text-base md:text-lg capitalize mb-1 ${
                isSelected ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {mood.name}
              </h3>
              
              {/* Mood Description */}
              <p className={`text-xs leading-tight ${
                isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {mood.description}
              </p>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center animate-gentle-pulse">
                  <Heart size={10} className="text-primary-foreground md:w-3 md:h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedMood && (
        <div className="text-center mt-6 animate-slide-up">
          <p className="text-sm text-muted-foreground">
            Perfect! I'll create a story to help with feeling <span className="font-semibold text-foreground">{selectedMood.name}</span> ✨
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;