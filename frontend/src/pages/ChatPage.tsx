import { ChatInterface } from "@/components/pages/Chat/ChatInterface";
import { ChatSidebar } from "@/components/pages/Chat/ChatSidebar";
import { useChat } from "@/hooks/use-chat";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ChatPage() {
  const {
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
    setCurrentMessage,
    sendMessage,
    startNewSession,
    selectSession,
    deleteSession,
    confirmDeleteSession,
    setIsHistoryOpen,
    setIsDeleteSessionOpen,
    setSessionToDelete
  } = useChat();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized career advice and job search guidance from our AI assistant
        </p>
      </div>

      <div className="h-full flex flex-col lg:flex-row gap-6">
        {/* Chat Interface */}
        <div className="flex-1 h-full">
          <ChatInterface
            messages={messages}
            currentMessage={currentMessage}
            isLoading={isLoading}
            error={error}
            onMessageChange={setCurrentMessage}
            onSendMessage={sendMessage}
          />
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 h-full">
          <ChatSidebar
            chatSessions={chatSessions}
            currentSessionId={currentSessionId}
            chatStats={chatStats}
            isHistoryOpen={isHistoryOpen}
            isDeleteSessionOpen={isDeleteSessionOpen}
            sessionToDelete={sessionToDelete}
            onNewSession={startNewSession}
            onSelectSession={selectSession}
            onDeleteSession={deleteSession}
            onCloseHistory={() => setIsHistoryOpen(false)}
            onCloseDeleteDialog={() => setIsDeleteSessionOpen(false)}
            onConfirmDelete={confirmDeleteSession}
          />
        </div>
      </div>
    </div>
  );
}
