import { useState, useCallback } from "react";
import { useChat } from "./hooks/useChat";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

export default function App() {
  const {
    conversations,
    activeConv,
    activeConvId,
    isStreaming,
    setActiveConvId,
    newConversation,
    send,
    stopStreaming,
    deleteConversation,
  } = useChat();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSend = useCallback(
    (msg, attachment = null) => {
      send(msg, attachment);
    },
    [send]
  );

  const handleSuggest = useCallback(
    (prompt) => {
      send(prompt);
    },
    [send]
  );

  const handleDelete = useCallback(
    (id) => {
      deleteConversation(id);
    },
    [deleteConversation]
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelect={setActiveConvId}
        onNew={newConversation}
        onDelete={handleDelete}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          conversation={activeConv}
          onDelete={handleDelete}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Chat messages */}
        <ChatWindow
          conversation={activeConv}
          isStreaming={isStreaming}
          onSuggest={handleSuggest}
        />

        {/* Input area */}
        <div className="shrink-0 px-4 pb-4 pt-2 border-t border-surface-3 bg-surface-1">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={handleSend}
              isStreaming={isStreaming}
              onStop={stopStreaming}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
