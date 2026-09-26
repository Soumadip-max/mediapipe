"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowUp,
  MessageCircleDashed,
  Plus,
  RefreshCw,
  Bot,
  User,
  Zap,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTypewriter } from "@/components/ui/ai-chat-card-utils/use-typewriter";

export interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface AIChatCardProps {
  title?: string;
  subtitle?: string;
  greeting?: string;
  prompt?: string;
  /** Prompts the composer types out on a loop. */
  prompts?: string[];
  /** Turn the prompt-typing animation off. */
  autoType?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  messages?: MessageItem[];
  loading?: boolean;
  onSend?: (message: string) => void;
  onReset?: () => void;
  onAttach?: () => void;
  className?: string;
}

const DEFAULT_PROMPTS = [
  "How to optimize React re-renders with useMemo and memo?",
  "Explain CORS preflight requests with code examples",
  "Difference between SQL and NoSQL indexing strategies",
  "Debug my async/await promise handling in Node.js",
];

const PROMPT_CHIPS = [
  {
    icon: Code2,
    title: "React Optimization",
    desc: "useMemo, useCallback & memoization patterns",
    query: "How do I optimize expensive component re-renders with React useMemo, useCallback, and memo?",
  },
  {
    icon: Cpu,
    title: "Node.js & Concurrency",
    desc: "Event loop, Promises & microtask queue",
    query: "Explain the Node.js Event Loop phases, microtasks vs macrotasks, and how async/await executes.",
  },
  {
    icon: Layers,
    title: "System Architecture",
    desc: "Distributed caching & database sharding",
    query: "Compare Redis caching strategies (Cache-Aside, Write-Through) with cache invalidation tradeoffs.",
  },
  {
    icon: Sparkles,
    title: "Algorithm Debugger",
    desc: "Time/space complexity & edge cases",
    query: "Analyze the time and space complexity of Dijkstra's shortest path algorithm with a min-heap priority queue.",
  },
];

export function AIChatCard({
  title = "Doubt Solver",
  subtitle = "Real-time contextual engineering debugger, code analysis, and architectural trade-off advisor",
  greeting = "Hello, Engineer!",
  prompt = "What technical question, bug trace, or architectural doubt can I resolve for you?",
  prompts = DEFAULT_PROMPTS,
  autoType = true,
  placeholder = "Ask any technical doubt, paste stack trace, or request code breakdown...",
  icon,
  messages = [],
  loading = false,
  onSend,
  onReset,
  onAttach,
  className,
}: AIChatCardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-10% 0px" });

  const [userActive, setUserActive] = React.useState(false);
  const [userMessage, setUserMessage] = React.useState("");
  const [spins, setSpins] = React.useState(0);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const { text: typedMessage, phase } = useTypewriter(prompts, {
    typeMs: 44,
    deleteMs: 16,
    holdMs: 2400,
    gapMs: 800,
    enabled: inView && !userActive && messages.length === 0,
  });

  const message = userActive ? userMessage : typedMessage;

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const takeOver = () => {
    if (userActive) return;
    setUserMessage(typedMessage);
    setUserActive(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        typedMessage.length,
        typedMessage.length,
      );
    }, 0);
  };

  const handleSendAction = (overrideText?: string) => {
    const textToSend = overrideText || (userActive || !autoType || messages.length > 0 ? userMessage : typedMessage);
    if (!textToSend || !textToSend.trim()) return;
    onSend?.(textToSend.trim());
    setUserMessage("");
    setUserActive(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendAction();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex w-full flex-col rounded-3xl bg-[#0c0e14]/95 text-[#e2e2eb]",
        "border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden transition-all",
        className,
      )}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 sm:px-8 py-5 bg-[#090a0f]/60">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#c3f400]/20 to-emerald-500/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)] shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-[#c4c9ac] line-clamp-1">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            onClick={() => {
              setSpins((count) => count + 1);
              setUserActive(false);
              setUserMessage("");
              onReset?.();
            }}
            whileTap={{ scale: 0.92 }}
            aria-label="Reset conversation"
            title="Reset Conversation"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1e2029] hover:bg-[#282a36] text-[#c3f400] transition-all cursor-pointer shadow-sm"
          >
            <motion.span
              animate={{ rotate: spins * 360 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.7 }}
              className="flex"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* ── Main Conversation Body OR Expansive Empty State ── */}
      <div className="flex flex-1 flex-col px-6 sm:px-8 py-6 overflow-y-auto max-h-[640px] min-h-[460px] custom-scrollbar">
        {messages && messages.length > 0 ? (
          <div className="flex flex-col gap-5 w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 w-full ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-9 h-9 rounded-2xl bg-[#c3f400]/20 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative group rounded-2xl px-5 py-4 max-w-[88%] text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#c3f400] text-[#191b22] font-semibold rounded-tr-none shadow-[0_4px_20px_rgba(195,244,0,0.15)]"
                      : "bg-[#181a24] text-white rounded-tl-none border border-white/10 whitespace-pre-wrap font-sans text-sm shadow-md"
                  }`}
                >
                  {msg.text}

                  {msg.sender === "ai" && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Copy Answer"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <div
                    className={`text-[11px] mt-2 font-mono ${
                      msg.sender === "user" ? "text-[#191b22]/70" : "text-[#c4c9ac]"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 font-bold text-xs shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-sm text-[#c3f400] font-medium p-3 rounded-2xl bg-[#181a24] border border-[#c3f400]/20 w-fit">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Zenith AI Engine is analyzing & debugging your query...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center my-auto py-6">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#1e2029] to-[#282a36] border border-[#c3f400]/30 text-[#c3f400] shadow-[0_0_25px_rgba(195,244,0,0.2)] mb-2"
            >
              {icon ?? <MessageCircleDashed className="h-8 w-8 text-[#c3f400]" />}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
            >
              {greeting}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mt-2 max-w-xl text-sm leading-relaxed text-[#c4c9ac]"
            >
              {prompt}
            </motion.p>

            {/* ── 4 Prominent Quick-Action Prompt Cards ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-3xl mt-8"
            >
              {PROMPT_CHIPS.map((chip, idx) => {
                const ChipIcon = chip.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendAction(chip.query)}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#141620] border border-white/10 hover:border-[#c3f400]/50 hover:bg-[#1c1e2b] text-left transition-all group cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(195,244,0,0.12)] hover:-translate-y-0.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#c3f400] flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      <ChipIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#c3f400] transition-colors">
                        {chip.title}
                      </div>
                      <p className="text-xs text-[#c4c9ac] mt-0.5 leading-snug line-clamp-1">
                        {chip.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Spacious Studio Composer ── */}
      <div className="px-6 sm:px-8 pb-6 pt-2 bg-[#090a0f]/60 border-t border-white/10">
        <div className="rounded-2xl bg-[#090b10] border border-white/15 p-4 transition-all focus-within:border-[#c3f400]/60 focus-within:shadow-[0_0_20px_rgba(195,244,0,0.15)] shadow-inner">
          {userActive || !autoType || messages.length > 0 ? (
            <textarea
              ref={textareaRef}
              value={userMessage}
              onChange={(event) => setUserMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              className="w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-[#c4c9ac]/50 font-sans"
            />
          ) : (
            <div
              onClick={takeOver}
              className="min-h-16 w-full cursor-text text-left text-sm leading-6 text-white font-sans"
            >
              {message}
              <motion.span
                aria-hidden
                className="ml-1 inline-block h-4 w-0.5 bg-[#c3f400] align-middle"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  times: [0, 0.5, 0.5, 1],
                }}
              />
              {!message ? (
                <span className="text-[#c4c9ac]/50">{placeholder}</span>
              ) : null}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={onAttach}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Add files"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1a1c26] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
                title="Attach code snippet or screenshot"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold">Enter ↵</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold">Shift+Enter</kbd> for new line
              </span>
            </div>

            <motion.button
              type="button"
              onClick={() => handleSendAction()}
              whileHover={{
                scale: 1.06,
                transition: { type: "spring", bounce: 0.5, duration: 0.4 },
              }}
              whileTap={{
                scale: 0.92,
                transition: { type: "spring", bounce: 0.4, duration: 0.4 },
              }}
              aria-label="Send message"
              className="group flex h-10 px-4 items-center justify-center gap-2 rounded-xl bg-[#c3f400] text-[#283500] font-bold text-xs shadow-[0_0_20px_rgba(195,244,0,0.4)] hover:bg-[#abd600] transition-colors cursor-pointer"
            >
              <span>Ask Doubt</span>
              <ArrowUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatCard;
