import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  contextUsed?: string[];
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  totalMessages: number;
}

export interface ChatStats {
  totalSessions: number;
  totalMessages: number;
  averageResponseTime: number;
  contextUsageRate: number;
}

export function useChatManagement() {
  const { toast } = useToast();
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Session management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Stats
  const [chatStats, setChatStats] = useState<ChatStats>({
    totalSessions: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    contextUsageRate: 0
  });
  const [responseTime, setResponseTime] = useState<number>(0);

  const calculateStats = useCallback((sessions: ChatSession[]) => {
    const totalSessions = sessions.length;
    const totalMessages = sessions.reduce((sum, session) => sum + session.totalMessages, 0);
    const messagesWithContext = sessions.reduce((sum, session) => 
      sum + session.messages.filter(msg => msg.contextUsed && msg.contextUsed.length > 0).length, 0
    );
    
    setChatStats({
      totalSessions,
      totalMessages,
      averageResponseTime: responseTime,
      contextUsageRate: totalMessages > 0 ? (messagesWithContext / totalMessages) * 100 : 0
    });
  }, [responseTime]);

  const loadChatSessions = useCallback(() => {
    try {
      const stored = localStorage.getItem('careercraft-chat-sessions');
      if (stored) {
        const sessions = JSON.parse(stored).map((session: { id: string; name: string; messages: Array<{ id: string; content: string; type: string; timestamp: string; contextUsed?: string[]; isError?: boolean }>; createdAt: string; lastActivity: string; totalMessages: number }) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastActivity: new Date(session.lastActivity),
          messages: session.messages.map((msg: { id: string; content: string; type: string; timestamp: string; contextUsed?: string[]; isError?: boolean }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessions);
        calculateStats(sessions);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  }, [calculateStats]);

  const saveChatSessions = useCallback((sessions: ChatSession[]) => {
    try {
      localStorage.setItem('careercraft-chat-sessions', JSON.stringify(sessions));
      calculateStats(sessions);
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }, [calculateStats]);

  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(newSessionId);
    
    const welcomeMessage: Message = {
      id: "welcome-message",
      type: "assistant",
      content: "Hello! I'm your CareerCraft.ai assistant. I can help you with resume advice, interview preparation, job application strategies, and more. How can I assist you today?",
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    setError(null);
  };

  const saveCurrentSession = useCallback(() => {
    if (!currentSessionId || messages.length === 0) return;

    const existingSessionIndex = chatSessions.findIndex(s => s.id === currentSessionId);
    const sessionName = generateSessionName(messages);
    
    const sessionData: ChatSession = {
      id: currentSessionId,
      name: sessionName,
      messages: [...messages],
      createdAt: existingSessionIndex >= 0 ? chatSessions[existingSessionIndex].createdAt : new Date(),
      lastActivity: new Date(),
      totalMessages: messages.length
    };

    let updatedSessions: ChatSession[];
    if (existingSessionIndex >= 0) {
      updatedSessions = [...chatSessions];
      updatedSessions[existingSessionIndex] = sessionData;
    } else {
      updatedSessions = [sessionData, ...chatSessions];
    }

    // Keep only the latest 20 sessions
    updatedSessions = updatedSessions.slice(0, 20);
    
    setChatSessions(updatedSessions);
    saveChatSessions(updatedSessions);
  }, [currentSessionId, messages, chatSessions, saveChatSessions]);

  // Load data on component mount
  useEffect(() => {
    loadChatSessions();
    startNewSession();
  }, [loadChatSessions]);

  // Save current session when messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      saveCurrentSession();
    }
  }, [messages, currentSessionId, saveCurrentSession]);

  const generateSessionName = (messages: Message[]): string => {
    const userMessages = messages.filter(m => m.type === "user");
    if (userMessages.length === 0) return "New Chat";
    
    // Use first user message, truncated
    const firstMessage = userMessages[0].content;
    if (firstMessage.length > 30) {
      return firstMessage.substring(0, 30) + "...";
    }
    return firstMessage;
  };

  const loadSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages([...session.messages]);
      setError(null);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    saveChatSessions(updatedSessions);
    
    if (currentSessionId === sessionId) {
      startNewSession();
    }
    
    toast({
      title: "Session Deleted",
      description: "Chat session has been removed",
    });
  };

  const checkResumeStatus = () => {
    try {
      const stored = localStorage.getItem('careercraft-saved-resumes');
      if (stored) {
        const resumes = JSON.parse(stored);
        return resumes.length > 0;
      }
    } catch (error) {
      console.error('Error checking resume status:', error);
    }
    return false;
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return false;

    // Check if user has uploaded a resume
    const hasResume = checkResumeStatus();
    if (!hasResume) {
      toast({
        title: "Resume Required",
        description: "Please upload a resume first to get personalized AI assistance.",
        variant: "destructive",
      });
      return false;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      const response = await apiClient.sendChatMessage(messageText);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const reply = response.data?.reply || response.reply;
      const contextUsed = response.data?.context_used || response.context_used || [];

      if (!reply) {
        throw new Error('No reply received from AI assistant');
      }

      const responseTime = Date.now() - startTime;
      setResponseTime(responseTime);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: reply,
        timestamp: new Date(),
        contextUsed: contextUsed
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (contextUsed && contextUsed.length > 0) {
        toast({
          title: "Resume Context Used",
          description: `AI referenced ${contextUsed.length} pieces from your resume to answer`,
        });
      } else {
        toast({
          title: "General Response",
          description: "AI provided a general answer. For personalized advice, ensure your resume is properly uploaded.",
          variant: "default",
        });
      }

      return true;

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);

      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('resume') || errorMessage.includes('context')) {
        userFriendlyMessage = "I couldn't access your resume information. Please ensure it's uploaded and try again.";
      }

      const errorChatMessage: Message = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: `I apologize, but I encountered an issue: ${userFriendlyMessage}. Please try again or check if your resume is properly uploaded.`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorChatMessage]);

      toast({
        title: "Chat Error",
        description: userFriendlyMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    if (messages.length === 0) return;

    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.type.toUpperCase()}: ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-${currentSessionId}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Exported",
      description: "Chat history downloaded successfully",
    });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    error,
    chatSessions,
    currentSessionId,
    chatStats,
    
    // Actions
    sendMessage,
    startNewSession,
    loadSession,
    deleteSession,
    exportChat,
    clearError,
    checkResumeStatus,
  };
}
