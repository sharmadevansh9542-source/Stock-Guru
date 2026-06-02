import { Plus, MessageSquare, Trash2, Bot, ChevronRight } from "lucide-react";

export default function Sidebar({
  conversations,
  activeConvId,
  onSelect,
  onNew,
  onDelete,
  collapsed,
  onToggle,
}) {
  return (
    <aside
      className={`flex flex-col h-full bg-surface-1 border-r border-surface-3 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-surface-3 h-14">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Bot size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-ink">NeuralChat</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center mx-auto">
            <Bot size={15} className="text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`text-ink-muted hover:text-ink transition-colors p-1 rounded ${collapsed ? "hidden" : ""}`}
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? "rotate-0" : "rotate-180"}`} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNew}
          className={`flex items-center gap-2 w-full rounded-xl border border-surface-4 hover:border-accent hover:bg-accent/10 transition-all duration-200 text-ink-muted hover:text-ink text-sm font-medium ${
            collapsed ? "justify-center p-2" : "px-3 py-2"
          }`}
        >
          <Plus size={16} />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {!collapsed && conversations.length === 0 && (
          <div className="text-center text-ink-dim text-xs py-8 px-4">
            No conversations yet. Start a new chat!
          </div>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center gap-2 rounded-xl px-2 py-2 cursor-pointer transition-all duration-150 ${
              activeConvId === conv.id
                ? "bg-accent/15 text-ink border border-accent/20"
                : "text-ink-muted hover:text-ink hover:bg-surface-2"
            } ${collapsed ? "justify-center" : ""}`}
            onClick={() => onSelect(conv.id)}
          >
            <MessageSquare
              size={15}
              className={`shrink-0 ${activeConvId === conv.id ? "text-accent" : ""}`}
            />
            {!collapsed && (
              <>
                <span className="flex-1 text-xs truncate">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-ink-dim hover:text-red-400 transition-all p-0.5 rounded"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-surface-3">
          <p className="text-ink-dim text-xs text-center">
            Powered by Claude Sonnet
          </p>
        </div>
      )}
    </aside>
  );
}
