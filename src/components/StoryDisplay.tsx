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
}

const StoryDisplay = ({ story, mood, childAge }: StoryDisplayProps) => {
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
Generated for: ${childAge} year old
Mood: ${mood?.name || 'Unknown'}
Date: ${new Date().toLocaleDateString()}

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
      <Card className="p-6 md:p-8 rounded-3xl border-2 border-primary/20 bg-gradient-story shadow-lg">
        {/* Story Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{mood?.emoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-story">
                Your {mood?.name} Story
              </h3>
              <p className="text-sm text-muted-foreground">
                Perfect for {childAge} year olds
              </p>
            </div>
          </div>
          
          <Button
            onClick={toggleReadingMode}
            variant="outline"
            size="sm"
            className="rounded-xl border-primary/30 hover:bg-primary/10"
          >
            <BookOpen size={16} className="mr-2" />
            {isReading ? 'Normal' : 'Reading'} Mode
          </Button>
        </div>

        {/* Story Content */}
        <div className={`
          mb-6 leading-relaxed font-story transition-all duration-300
          ${isReading 
            ? 'text-xl md:text-2xl leading-loose bg-card p-6 rounded-2xl border border-border' 
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
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleTextToSpeech}
            variant="outline"
            className="rounded-xl border-primary/30 hover:bg-primary/10 transition-colors"
          >
            {isPlaying ? (
              <>
                <VolumeX size={16} className="mr-2" />
                Stop Reading
              </>
            ) : (
              <>
                <Volume2 size={16} className="mr-2" />
                Read Aloud
              </>
            )}
          </Button>

          <Button
            onClick={handleCopyStory}
            variant="outline"
            className="rounded-xl border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <Copy size={16} className="mr-2" />
            Copy Story
          </Button>

          <Button
            onClick={handleDownloadStory}
            variant="outline"
            className="rounded-xl border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="mt-6 p-4 bg-accent/20 rounded-2xl border border-accent/30">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Use reading mode for bedtime stories, or read aloud to make it interactive!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StoryDisplay;