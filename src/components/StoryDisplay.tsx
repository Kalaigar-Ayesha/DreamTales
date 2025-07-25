import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, VolumeX, Download, BookOpen, Copy } from "lucide-react";
import { Mood } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface StoryDisplayProps {
  story: string;
  mood: Mood | null;
  childAge: number;
  childName?: string;
  currentSituation?: string;
  desiredOutcome?: string;
  gender?: string;
  moralValue?: string;
  storyType?: string;
  storyLength?: string;
}

const StoryDisplay = ({ 
  story, 
  mood, 
  childAge, 
  childName, 
  currentSituation, 
  desiredOutcome, 
  gender, 
  moralValue, 
  storyType, 
  storyLength 
}: StoryDisplayProps) => {
  const [isReading, setIsReading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(story);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive"
      });
    }
  };

  const handleCopyStory = async () => {
    try {
      await navigator.clipboard.writeText(story);
      toast({
        title: "Story copied!",
        description: "The story has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy the story to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadStory = () => {
    const storyContent = `DreamTales Story
Generated for: ${childName ? childName + ', ' : ''}${childAge} year old${gender ? ` ${gender.toLowerCase()}` : ''}
Mood: ${mood?.name || 'Unknown'}
${currentSituation ? `Situation: ${currentSituation}\n` : ''}${desiredOutcome ? `Goal: ${desiredOutcome}\n` : ''}${moralValue ? `Teaching: ${moralValue}\n` : ''}${storyType ? `Type: ${storyType}\n` : ''}${storyLength ? `Length: ${storyLength}\n` : ''}Date: ${new Date().toLocaleDateString()}

${story}

---
Created with love by DreamTales ✨`;

    const blob = new Blob([storyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dreamtales-story-${mood?.name}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Story downloaded!",
      description: "Your magical story has been saved.",
    });
  };

  const toggleReadingMode = () => {
    setIsReading(!isReading);
  };

  return (
    <div className="animate-slide-up">
      <Card className="p-6 md:p-8 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-background via-primary-soft/20 to-accent/20 shadow-xl shadow-primary/10 backdrop-blur-sm">
        {/* Story Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{mood?.emoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-story">
                {childName ? `${childName}'s` : 'Your'} {mood?.name} Story
              </h3>
              <p className="text-sm text-muted-foreground">
                Perfect for {childAge} year old{gender ? ` ${gender.toLowerCase()}` : 's'}
              </p>
            </div>
          </div>
          
          <Button
            onClick={toggleReadingMode}
            variant="outline"
            size="sm"
            className="rounded-xl border-emotions-calm/40 bg-gradient-to-r from-emotions-calm/20 to-emotions-calm/10 hover:from-emotions-calm/30 hover:to-emotions-calm/40 transition-all duration-300"
          >
            <BookOpen size={16} className="mr-2" />
            {isReading ? 'Normal' : 'Reading'} Mode
          </Button>
        </div>

        {/* Personalization Details */}
        {(currentSituation || desiredOutcome || moralValue || storyType || storyLength) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-accent/20 via-primary-soft/20 to-secondary/20 rounded-2xl border border-primary/20 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {currentSituation && (
                <div>
                  <span className="text-muted-foreground">Situation:</span>
                  <span className="ml-2 text-foreground font-medium">{currentSituation}</span>
                </div>
              )}
              {desiredOutcome && (
                <div>
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="ml-2 text-foreground font-medium">{desiredOutcome}</span>
                </div>
              )}
              {moralValue && (
                <div>
                  <span className="text-muted-foreground">Teaching:</span>
                  <span className="ml-2 text-foreground font-medium">{moralValue}</span>
                </div>
              )}
              {storyType && (
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 text-foreground font-medium">{storyType}</span>
                </div>
              )}
              {storyLength && (
                <div>
                  <span className="text-muted-foreground">Length:</span>
                  <span className="ml-2 text-foreground font-medium">{storyLength}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Story Content */}
        <div className={`
          mb-6 leading-relaxed font-story transition-all duration-300
          ${isReading 
            ? 'text-xl md:text-2xl leading-loose bg-gradient-to-br from-card via-primary-soft/10 to-accent/10 p-6 rounded-2xl border border-primary/20 shadow-inner' 
            : 'text-base md:text-lg'
          }
        `}>
          {story.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0 text-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center px-2">
          <Button
            onClick={handleTextToSpeech}
            variant="outline"
            size="sm"
            className="rounded-xl border-primary/40 bg-gradient-to-r from-primary-soft/20 to-primary/10 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 min-w-[120px] shadow-sm"
          >
            {isPlaying ? (
              <>
                <VolumeX size={16} className="mr-2" />
                <span className="hidden xs:inline">Stop Reading</span>
                <span className="xs:hidden">Stop</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="mr-2" />
                <span className="hidden xs:inline">Read Aloud</span>
                <span className="xs:hidden">Read</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleCopyStory}
            variant="outline"
            size="sm"
            className="rounded-xl border-accent/40 bg-gradient-to-r from-accent/20 to-accent/10 hover:from-accent/30 hover:to-accent/40 transition-all duration-300 min-w-[100px] shadow-sm"
          >
            <Copy size={16} className="mr-2" />
            Copy
          </Button>

          <Button
            onClick={handleDownloadStory}
            variant="outline"
            size="sm"
            className="rounded-xl border-secondary/40 bg-gradient-to-r from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/40 transition-all duration-300 min-w-[120px] shadow-sm"
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emotions-happy/20 via-primary-soft/20 to-emotions-calm/20 rounded-2xl border border-primary/20 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Use reading mode for bedtime stories, or read aloud to make it interactive!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StoryDisplay;