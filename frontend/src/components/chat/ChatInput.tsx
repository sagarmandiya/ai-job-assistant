import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  hasResume: boolean;
}

export default function ChatInput({ 
  currentMessage, 
  setCurrentMessage, 
  onSendMessage, 
  isLoading, 
  hasResume 
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder={hasResume ? "Ask me anything about your job search..." : "Upload a resume first to get personalized assistance"}
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading || !hasResume}
        className="flex-1"
      />
      <Button 
        onClick={onSendMessage}
        disabled={isLoading || !currentMessage.trim() || !hasResume}
        size="sm"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}