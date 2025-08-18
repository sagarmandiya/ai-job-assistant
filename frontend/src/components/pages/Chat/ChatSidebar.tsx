import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { History, Trash2, Plus, Calendar, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
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

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  chatStats: ChatStats;
  isHistoryOpen: boolean;
  isDeleteSessionOpen: boolean;
  sessionToDelete: string | null;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onCloseHistory: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

export function ChatSidebar({
  chatSessions,
  currentSessionId,
  chatStats,
  isHistoryOpen,
  isDeleteSessionOpen,
  sessionToDelete,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onCloseHistory,
  onCloseDeleteDialog,
  onConfirmDelete
}: ChatSidebarProps) {
  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewSession}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {chatStats.totalSessions} sessions, {chatStats.totalMessages} messages
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="space-y-2 p-4">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No chat history</p>
                <p className="text-sm">Start a new conversation</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-primary/10 border-primary/20'
                      : 'hover:bg-muted/50 border-border'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {session.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTimeAgo(session.lastActivity)}</span>
                        <span>•</span>
                        <MessageSquare className="w-3 h-3" />
                        <span>{session.totalMessages} messages</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Session Dialog */}
      <Dialog open={isDeleteSessionOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
