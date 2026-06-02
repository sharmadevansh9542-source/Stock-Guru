import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User, FileText, Image, File } from "lucide-react";
import { useState } from "react";

function getFileIcon(mimeType) {
  if (!mimeType) return <File size={13} />;
  if (mimeType.startsWith("image/")) return <Image size={13} />;
  if (mimeType === "application/pdf") return <FileText size={13} />;
  return <FileText size={13} />;
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors px-2 py-1 rounded bg-surface-4 hover:bg-surface-3"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ language, children }) {
  const code = String(children).replace(/\n$/, "");

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-surface-4">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-3 border-b border-surface-4">
        <span className="text-xs font-mono text-ink-muted">{language || "code"}</span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "#111114",
          fontSize: "0.8rem",
          lineHeight: "1.6",
          padding: "16px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === "user";
  const isEmpty = !message.content && isStreaming;

  return (
    <div
      className={`flex gap-3 animate-slide-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-surface-3 border border-surface-4"
            : "bg-accent/20 border border-accent/30"
        }`}
      >
        {isUser ? (
          <User size={15} className="text-ink-muted" />
        ) : (
          <Bot size={15} className="text-accent" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-accent text-white rounded-tr-sm"
              : "bg-surface-2 border border-surface-3 text-ink rounded-tl-sm"
          } ${message.error ? "bg-red-900/20 border-red-800/30 text-red-300" : ""}`}
        >
          {isEmpty ? (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-soft animate-pulse-soft" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent-soft animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent-soft animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
            </div>
          ) : isUser ? (
            <div className="flex flex-col gap-2">
              {/* File attachment chip */}
              {message.attachment && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs">
                  <span className="text-white/80 shrink-0">
                    {getFileIcon(message.attachment.mimeType)}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-medium truncate">{message.attachment.fileName}</span>
                    <span className="text-white/60">
                      {message.attachment.fileType} · {formatBytes(message.attachment.sizeBytes)}
                    </span>
                  </div>
                </div>
              )}
              {message.content && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          ) : (
            <div className="prose-chat text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <CodeBlock language={match?.[1]}>{children}</CodeBlock>
                    ) : (
                      <code className="bg-surface-3 text-accent-soft px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-soft hover:text-accent underline underline-offset-2"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-accent animate-blink ml-0.5 align-text-bottom" />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-ink-dim px-1">
          {new Date(message.ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
