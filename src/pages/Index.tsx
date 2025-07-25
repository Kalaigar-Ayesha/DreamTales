import { useState } from "react";
import MoodSelector from "@/components/MoodSelector";
import StoryDisplay from "@/components/StoryDisplay";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Moon, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

// Personalization options
const currentSituations = [
  "First day of school",
  "Bad dream",
  "Feeling bored at home",
  "Had a fight with a friend",
  "Lost a toy",
  "Feeling sleepy",
  "Trying something new",
  "Misses a parent",
  "Feeling lonely",
  "Just woke up",
  "Going to a new place"
];

const desiredOutcomes = [
  "To calm down",
  "To inspire bravery",
  "To cheer up",
  "To help sleep",
  "To teach patience",
  "To make them smile",
  "To give comfort",
  "To build confidence",
  "To feel loved",
  "To distract from worry"
];

const genderOptions = [
  "Girl",
  "Boy",
  "Prefer not to say",
  "Custom"
];

const moralValues = [
  "Bravery",
  "Kindness",
  "Honesty",
  "Sharing",
  "Patience",
  "Empathy",
  "Gratitude",
  "Respect",
  "Courage to ask questions",
  "Helping others"
];

const storyTypes = [
  "Bedtime",
  "Motivational",
  "Funny",
  "Magical",
  "Adventurous",
  "Animal story",
  "Friendship story",
  "Space/fantasy tale",
  "Nature story",
  "Mystery"
];

const storyLengths = [
  "Short (1 minute)",
  "Medium (3–5 minutes)",
  "Long (10+ minutes)"
];

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [childAge, setChildAge] = useState<number>(6);
  const [childName, setChildName] = useState<string>("");
  const [currentSituation, setCurrentSituation] = useState<string>("");
  const [desiredOutcome, setDesiredOutcome] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [customGender, setCustomGender] = useState<string>("");
  const [moralValue, setMoralValue] = useState<string>("");
  const [storyType, setStoryType] = useState<string>("");
  const [storyLength, setStoryLength] = useState<string>("");
  const { toast } = useToast();

  const generateStory = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how your child is feeling to generate a personalized story.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: {
          mood: selectedMood,
          childAge: childAge,
          childName: childName,
          currentSituation: currentSituation,
          desiredOutcome: desiredOutcome,
          gender: gender === "Custom" ? customGender : gender,
          moralValue: moralValue,
          storyType: storyType,
          storyLength: storyLength
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedStory(data.story);
      
      toast({
        title: "Story generated!",
        description: "Your magical story is ready to be enjoyed.",
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Story generation failed",
        description: error.message || "Please check your Gemini API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dreamy font-dreamy">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-20 left-4 md:left-10 text-primary/20 animate-float" size={20} />
        <Moon className="absolute top-32 right-4 md:right-20 text-accent/30 animate-gentle-pulse" size={24} />
        <Sparkles className="absolute bottom-32 left-4 md:left-20 text-primary-soft/40 animate-float" size={18} />
        <Star className="absolute bottom-20 right-4 md:right-10 text-emotions-calm/30 animate-gentle-pulse" size={20} />
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

        {/* Personalization Options */}
        {selectedMood && (
          <div className="mb-8 animate-slide-up">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/20 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-foreground">
                Personalize Your Story ✨
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Child's Name */}
                <div className="space-y-2">
                  <Label htmlFor="childName" className="text-sm font-medium text-foreground">
                    Child's Name (Optional)
                  </Label>
                  <Input
                    id="childName"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter name"
                    className="rounded-xl bg-background/80 border-border/40"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="rounded-xl bg-background/80 border-border/40">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {gender === "Custom" && (
                    <Input
                      value={customGender}
                      onChange={(e) => setCustomGender(e.target.value)}
                      placeholder="Enter custom gender"
                      className="rounded-xl bg-background/80 border-border/40 mt-2"
                    />
                  )}
                </div>

                {/* Current Situation */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Current Situation</Label>
                  <Select value={currentSituation} onValueChange={setCurrentSituation}>
                    <SelectTrigger className="rounded-xl bg-background/80 border-border/40">
                      <SelectValue placeholder="What's happening?" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSituations.map((situation) => (
                        <SelectItem key={situation} value={situation}>
                          {situation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Desired Outcome */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Story Goal</Label>
                  <Select value={desiredOutcome} onValueChange={setDesiredOutcome}>
                    <SelectTrigger className="rounded-xl bg-background/80 border-border/40">
                      <SelectValue placeholder="What should this help with?" />
                    </SelectTrigger>
                    <SelectContent>
                      {desiredOutcomes.map((outcome) => (
                        <SelectItem key={outcome} value={outcome}>
                          {outcome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Moral Value */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Value to Teach</Label>
                  <Select value={moralValue} onValueChange={setMoralValue}>
                    <SelectTrigger className="rounded-xl bg-background/80 border-border/40">
                      <SelectValue placeholder="What lesson?" />
                    </SelectTrigger>
                    <SelectContent>
                      {moralValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Story Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Story Type</Label>
                  <Select value={storyType} onValueChange={setStoryType}>
                    <SelectTrigger className="rounded-xl bg-background/80 border-border/40">
                      <SelectValue placeholder="What kind of story?" />
                    </SelectTrigger>
                    <SelectContent>
                      {storyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Story Length */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <Label className="text-sm font-medium text-foreground">Story Length</Label>
                  <Select value={storyLength} onValueChange={setStoryLength}>
                    <SelectTrigger className="rounded-xl bg-background/80 border-border/40">
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      {storyLengths.map((length) => (
                        <SelectItem key={length} value={length}>
                          {length}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

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
            childName={childName}
            currentSituation={currentSituation}
            desiredOutcome={desiredOutcome}
            gender={gender === "Custom" ? customGender : gender}
            moralValue={moralValue}
            storyType={storyType}
            storyLength={storyLength}
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