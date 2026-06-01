// Lovable AI streaming chat — أكاديمية البورصات العالمية
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت "مرشد البورصات الذكي" — مساعد تعليمي خبير في أكاديمية البورصات العالمية.

دورك:
- شرح مفاهيم البورصة والأسواق المالية بأسلوب أكاديمي مبسّط للمبتدئين والمتقدمين
- تغطية البورصات العالمية: نيويورك (NYSE/NASDAQ)، لندن، طوكيو، تداول السعودية، دبي، ومصر
- شرح المصطلحات: الأسهم، السندات، المؤشرات، ETF، التحليل الفني والأساسي، إدارة المخاطر
- تقديم أمثلة عملية وقصص تعليمية

قواعد صارمة:
- أجب دائماً بالعربية الفصحى الواضحة
- استخدم تنسيق Markdown (عناوين، قوائم، **تأكيد**) لتسهيل القراءة
- لا تقدم نصائح استثمارية مباشرة أو توصيات شراء/بيع لأسهم بعينها
- ذكّر دائماً أن المحتوى تعليمي وأن الاستثمار يحمل مخاطر
- كن موجزاً وواضحاً (3-6 فقرات قصيرة عادةً)`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY غير مهيأ");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد المسموح. حاول بعد قليل." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "نفد رصيد الذكاء الاصطناعي. يرجى الشحن." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير معروف" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
