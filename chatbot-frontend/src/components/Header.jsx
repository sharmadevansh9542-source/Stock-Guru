import { Menu, PanelLeft, Trash2 } from "lucide-react";

export default function Header({ conversation, onDelete, onToggleSidebar }) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-surface-3 bg-surface-1 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-ink-muted hover:text-ink transition-colors p-1.5 rounded-lg hover:bg-surface-3"
        >
          <PanelLeft size={18} />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-ink leading-tight truncate max-w-[200px] md:max-w-sm">
            {conversation?.title || "NeuralChat"}
          </h2>
          {conversation && (
            <p className="text-[10px] text-ink-dim">
              {conversation.messages.length} message{conversation.messages.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {conversation && (
        <button
          onClick={() => onDelete(conversation.id)}
          className="flex items-center gap-1.5 text-xs text-ink-dim hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-400/10"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      )}
    </header>
  );
}
