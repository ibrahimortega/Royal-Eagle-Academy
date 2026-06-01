import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "اشرح لي مؤشر S&P 500 ببساطة",
  "ما الفرق بين السهم والسند؟",
  "كيف أبدأ الاستثمار في بورصة نيويورك؟",
  "ما هي أفضل استراتيجيات إدارة المخاطر؟",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "كثرة الطلبات", description: "حاول بعد قليل من فضلك.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "نفد الرصيد", description: "يرجى شحن رصيد الذكاء الاصطناعي.", variant: "destructive" });
        } else {
          toast({ title: "تعذّر الاتصال", description: "حدث خطأ في خدمة المساعد.", variant: "destructive" });
        }
        setLoading(false);
        return;
      }

      let assistantSoFar = "";
      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
        scrollToBottom();
      };

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: rdone, value } = await reader.read();
        if (rdone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "خطأ", description: "تعذّر الوصول للمساعد الذكي.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assistant" className="relative py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Heading */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Gemini AI
            </div>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              <span className="text-foreground">المساعد </span>
              <span className="text-gradient-ai">التعليمي الذكي</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              اسأل أي سؤال حول البورصات، الأسهم، أو المفاهيم المالية وستحصل على
              إجابة فورية مدعومة بالذكاء الاصطناعي.
            </p>
          </div>

          {/* Chat card */}
          <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-elegant">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-foreground/10 bg-secondary/40 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-ai shadow-ai">
                  <Bot className="h-4 w-4 text-foreground" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">مرشد البورصات الذكي</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    متصل الآن
                  </div>
                </div>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">Gemini 2.5 Flash</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-[420px] space-y-4 overflow-y-auto p-5 md:p-6">
              {messages.length === 0 && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-ai">
                    <Bot className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="rounded-2xl rounded-tr-sm bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground">
                    مرحباً بك في أكاديمية البورصات 👋
                    <br />
                    أنا مرشدك الذكي. اسألني عن أي مفهوم في الأسواق المالية —
                    من الأسهم والسندات إلى التحليل الفني واستراتيجيات الاستثمار.
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      m.role === "user" ? "gradient-gold" : "gradient-ai"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="h-4 w-4 text-navy-deep" />
                    ) : (
                      <Bot className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-tl-sm bg-gold/15 text-foreground"
                        : "prose-chat rounded-tr-sm bg-secondary text-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-ai">
                    <Bot className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="rounded-2xl rounded-tr-sm bg-secondary px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="border-t border-foreground/10 px-5 py-3">
                <div className="mb-2 text-xs text-muted-foreground">اقتراحات للبدء:</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/15"
                    >
                      ✨ {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-foreground/10 bg-secondary/30 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك حول البورصة هنا..."
                disabled={loading}
                className="flex-1 rounded-xl border border-foreground/10 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-ai shadow-ai transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                aria-label="إرسال"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                ) : (
                  <Send className="h-5 w-5 -scale-x-100 text-foreground" />
                )}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            ⚠️ المحتوى تعليمي فقط ولا يعتبر نصيحة استثمارية. الاستثمار يحمل مخاطر.
          </p>
        </div>
      </div>
    </section>
  );
};
