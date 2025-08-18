import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  contextUsed?: string[];
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  totalMessages: number;
}

interface ChatStats {
  totalSessions: number;
  totalMessages: number;
  averageResponseTime: number;
  contextUsageRate: number;
}

export function useChat() {
  const { toast } = useToast();
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Session management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteSessionOpen, setIsDeleteSessionOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  
  // Stats and settings
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
    const responseTimes = sessions.flatMap(session => 
      session.messages
        .filter(msg => msg.type === 'assistant' && !msg.isError)
        .map(msg => msg.timestamp.getTime())
    );
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;
    
    const contextUsageRate = sessions.reduce((sum, session) => 
      sum + session.messages.filter(msg => msg.contextUsed && msg.contextUsed.length > 0).length, 0
    ) / Math.max(totalMessages, 1) * 100;

    setChatStats({
      totalSessions,
      totalMessages,
      averageResponseTime,
      contextUsageRate
    });
  }, []);

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

  const saveCurrentSession = useCallback(() => {
    if (!currentSessionId) return;

    const session: ChatSession = {
      id: currentSessionId,
      name: generateSessionName(messages),
      messages,
      createdAt: new Date(),
      lastActivity: new Date(),
      totalMessages: messages.length
    };

    const updatedSessions = chatSessions.map(s => 
      s.id === currentSessionId ? session : s
    );
    
    if (!chatSessions.find(s => s.id === currentSessionId)) {
      updatedSessions.unshift(session);
    }

    setChatSessions(updatedSessions);
    localStorage.setItem('careercraft-chat-sessions', JSON.stringify(updatedSessions));
    calculateStats(updatedSessions);
  }, [currentSessionId, messages, chatSessions, calculateStats]);

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
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    return 'New Conversation';
  };

  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
    setCurrentMessage("");
    setError(null);
  };

  const selectSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setCurrentMessage("");
      setError(null);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsDeleteSessionOpen(true);
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;

    const updatedSessions = chatSessions.filter(s => s.id !== sessionToDelete);
    setChatSessions(updatedSessions);
    localStorage.setItem('careercraft-chat-sessions', JSON.stringify(updatedSessions));
    calculateStats(updatedSessions);

    if (currentSessionId === sessionToDelete) {
      startNewSession();
    }

    setSessionToDelete(null);
    setIsDeleteSessionOpen(false);
    
    toast({
      title: "Session Deleted",
      description: "Chat session has been removed.",
    });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      const response = await apiClient.sendChatMessage(currentMessage.trim());
      
      if (response.error) {
        throw new Error(response.error);
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'assistant',
        content: response.data?.reply || response.reply || 'No response received',
        timestamp: new Date(),
        contextUsed: response.data?.context_used || response.context_used
      };

      setMessages(prev => [...prev, assistantMessage]);
      setResponseTime(Date.now() - startTime);

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'assistant',
        content: error instanceof Error ? error.message : 'Failed to get response',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to get response from AI. Please try again.');
      
      toast({
        title: "Chat Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    messages,
    currentMessage,
    isLoading,
    error,
    chatSessions,
    currentSessionId,
    isHistoryOpen,
    isDeleteSessionOpen,
    sessionToDelete,
    chatStats,
    responseTime,
    
    // Actions
    setCurrentMessage,
    sendMessage,
    startNewSession,
    selectSession,
    deleteSession,
    confirmDeleteSession,
    setIsHistoryOpen,
    setIsDeleteSessionOpen,
    setSessionToDelete
  };
}
