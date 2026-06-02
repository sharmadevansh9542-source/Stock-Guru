import { Sparkles, Code2, BookOpen, Lightbulb } from "lucide-react";

const suggestions = [
  {
    icon: Code2,
    label: "Write code",
    prompt: "Write a Python function that sorts a list of dictionaries by a given key.",
  },
  {
    icon: BookOpen,
    label: "Explain a concept",
    prompt: "Explain how transformer models work in simple terms.",
  },
  {
    icon: Lightbulb,
    label: "Brainstorm ideas",
    prompt: "Give me 10 creative startup ideas in the AI productivity space.",
  },
  {
    icon: Sparkles,
    label: "Summarize text",
    prompt: "Summarize the key points of the latest developments in quantum computing.",
  },
];

export default function WelcomeScreen({ onSuggest }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in">
      {/* Logo */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
          <Sparkles size={28} className="text-accent" />
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-accent/10 blur-xl -z-10" />
      </div>

      <h1 className="font-display text-3xl font-bold text-ink mb-2">
        How can I help?
      </h1>
      <p className="text-ink-muted text-sm max-w-sm mb-10">
        Ask me anything — from coding questions to creative writing to complex analysis.
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => onSuggest(s.prompt)}
              className="flex items-start gap-3 p-4 rounded-2xl bg-surface-2 border border-surface-3 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-3 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
                <Icon size={15} className="text-ink-muted group-hover:text-accent transition-colors" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink mb-0.5">{s.label}</p>
                <p className="text-[11px] text-ink-dim leading-snug line-clamp-2">{s.prompt}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
