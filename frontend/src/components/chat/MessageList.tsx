import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Copy, AlertCircle } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Message } from "@/hooks/useChatManagement";

interface MessageListProps {
  messages: Message[];
  onCopyMessage: (content: string) => void;
}

export default function MessageList({ messages, onCopyMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
        >
          {message.type === "assistant" && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.isError ? "bg-destructive/10" : "bg-primary/10"
            }`}>
              {message.isError ? (
                <AlertCircle className="w-4 h-4 text-destructive" />
              ) : (
                <Bot className="w-4 h-4 text-primary" />
              )}
            </div>
          )}
          
          <div className="flex flex-col max-w-xs lg:max-w-md">
            <div
              className={`px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.isError
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.type === "assistant" ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                {message.contextUsed && message.contextUsed.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Context: {message.contextUsed.length} chunks
                  </Badge>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyMessage(message.content)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {message.type === "user" && (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <User className="w-4 h-4 text-accent-foreground" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}