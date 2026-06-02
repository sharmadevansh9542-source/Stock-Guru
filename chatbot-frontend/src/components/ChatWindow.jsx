import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";

export default function ChatWindow({ conversation, isStreaming, onSuggest }) {
  const bottomRef = useRef(null);
  const messages = conversation?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation || messages.length === 0) {
    return <WelcomeScreen onSuggest={onSuggest} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
      <div className="max-w-3xl mx-auto space-y-5">
        {messages.map((msg, i) => {
          const isLast = i === messages.length - 1;
          const isStreamingMsg = isLast && msg.role === "assistant" && isStreaming;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={isStreamingMsg}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
