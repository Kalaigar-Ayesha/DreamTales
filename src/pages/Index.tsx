import { useState } from "react";
import MoodSelector from "@/components/MoodSelector";
import StoryDisplay from "@/components/StoryDisplay";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Star } from "lucide-react";

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [childAge, setChildAge] = useState<number>(6);

  const generateStory = async () => {
    if (!selectedMood) return;

    setIsGenerating(true);
    
    // Simulate story generation (will need OpenAI API integration)
    setTimeout(() => {
      const sampleStory = `Once upon a time, in a magical forest where the trees whispered secrets and flowers sang lullabies, there lived a little ${selectedMood.name === 'happy' ? 'bunny named Joy who loved to dance in the sunlight' : selectedMood.name === 'sad' ? 'bear named Hope who learned that even cloudy days bring beautiful rainbows' : selectedMood.name === 'scared' ? 'fox named Brave who discovered that the scary shadows were just friendly trees dancing' : selectedMood.name === 'excited' ? 'squirrel named Zip who couldn\'t wait to share adventures with friends' : selectedMood.name === 'angry' ? 'lion named Peace who learned to take deep breaths and count to ten' : 'owl named Calm who taught everyone the magic of quiet moments'}. 

This gentle creature learned that every feeling is like a color in a beautiful painting - each one important and special. And as the stars twinkled above, they realized that tomorrow would bring new adventures and joy.

The End. ✨`;
      
      setGeneratedStory(sampleStory);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-dreamy font-dreamy">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-20 left-10 text-primary/20 animate-float" size={24} />
        <Moon className="absolute top-32 right-20 text-accent/30 animate-gentle-pulse" size={28} />
        <Sparkles className="absolute bottom-32 left-20 text-primary-soft/40 animate-float" size={20} />
        <Star className="absolute bottom-20 right-10 text-emotions-calm/30 animate-gentle-pulse" size={22} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-primary mr-3 animate-gentle-pulse" size={32} />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary-soft bg-clip-text text-transparent">
              DreamTales
            </h1>
            <Sparkles className="text-primary ml-3 animate-gentle-pulse" size={32} />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 font-story">
            Magical AI stories that match your little one's mood ✨
          </p>
          
          {/* Age Selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <label htmlFor="age" className="text-sm font-medium text-foreground">
              Child's Age:
            </label>
            <select 
              id="age"
              value={childAge} 
              onChange={(e) => setChildAge(parseInt(e.target.value))}
              className="px-4 py-2 rounded-xl border border-border bg-card text-card-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(age => (
                <option key={age} value={age}>{age} years old</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="mb-8">
          <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
        </div>

        {/* Generate Button */}
        {selectedMood && (
          <div className="text-center mb-8 animate-slide-up">
            <Button 
              onClick={generateStory}
              disabled={isGenerating}
              className="px-8 py-4 text-lg rounded-3xl bg-gradient-mood hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Creating your story...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Generate My Story
                  <Sparkles size={20} />
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Story Display */}
        {generatedStory && (
          <StoryDisplay 
            story={generatedStory} 
            mood={selectedMood} 
            childAge={childAge}
          />
        )}

        {/* Instructions */}
        {!selectedMood && (
          <div className="text-center text-muted-foreground animate-slide-up">
            <p className="text-sm">👆 Choose how your child is feeling to create a personalized story</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;