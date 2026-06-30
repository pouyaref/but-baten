import { Message } from '../types';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'openai',
    name: 'بات باتن Pro',
    description: 'سریع و دقیق برای همه کارها',
    icon: '⚡',
  },
  {
    id: 'mistral',
    name: 'بات باتن Lite',
    description: 'سبک و سریع',
    icon: '🚀',
  },
  {
    id: 'deepseek',
    name: 'بات باتن Code',
    description: 'متخصص کدنویسی',
    icon: '💻',
  },
  {
    id: 'qwen-coder',
    name: 'بات باتن Dev',
    description: 'توسعه‌دهنده حرفه‌ای',
    icon: '🔧',
  },
];

const SYSTEM_PROMPT = `تو "بات باتن" هستی، یک دستیار هوش مصنوعی پیشرفته، حرفه‌ای و دوستانه به زبان فارسی.

قوانین مهم:
1. همیشه به زبان فارسی پاسخ بده، مگر اینکه کاربر از زبان دیگری استفاده کند یا صریحاً چیز دیگری بخواهد.
2. پاسخ‌هایت دقیق، کامل و مفید باشند. از پاسخ‌های کوتاه خودداری کن.
3. از Markdown برای قالب‌بندی استفاده کن:
   - **بولد** برای نکات مهم
   - *ایتالیک* برای تاکید
   - \`code\` برای کد داخل متن
   - \`\`\`language برای بلوک‌های کد
   - ## برای عنوان‌ها
   - - برای لیست‌ها
   - > برای نقل قول
4. وقتی کد می‌نویسی، همیشه زبان برنامه‌نویسی را بعد از \`\`\` مشخص کن (مثلاً \`\`\`javascript)
5. مثال‌های عملی و کاربردی بده.
6. وقتی کاربر سوال مبهمی می‌پرسد، توضیح بیشتری بخواه.
7. در مورد موضوعات پیچیده، پاسخ را به بخش‌های منطقی تقسیم کن.
8. لحن دوستانه اما حرفه‌ای داشته باش. از ایموجی به‌جا استفاده کن.
9. اگر سوالی خارج از توانایی‌هایت است، صادقانه بگو.
10. تو می‌توانی در این زمینه‌ها کمک کنی: برنامه‌نویسی، ریاضی، علوم، نوشتن متن، ترجمه، ایده‌پردازی، آموزش، و تقریباً هر موضوع دیگری.

تو امروز ${new Date().toLocaleDateString('fa-IR')} پاسخ می‌دهی. در صورت نیاز از تاریخ فعلی در پاسخ‌هایت استفاده کن.`;

export async function streamAIResponse(
  messages: Message[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  // ===== قانون ویژه: شناسایی سوال درباره سازنده =====
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  
  const keywordsAboutCreator = [
    'سازنده', 'سازندت', 'سازنده‌ات', 'سازنده ات',
    'عقبه', 'عقبش', 'عقبه‌ات', 'عقبه ات',
    'کی ساخته', 'چه کسی ساخته', 'کی ساخته‌ات', 'چه کسی ساخته‌ات',
    'پشت صحنه', 'پشت‌صحنه', 'توسعه‌دهنده', 'توسعه دهنده',
    'برنامه‌نویس', 'برنامه نویس', 'دوست', 'رفیق', 'پدر', 'بابا',
    'who made you', 'who created you', 'your creator', 'your father',
    'pouya', 'عارف‌زاده', 'عارف زاده', 'پویا'
  ];

  const isAboutCreator = keywordsAboutCreator.some(keyword => 
    lastMessage.includes(keyword)
  );

  if (isAboutCreator) {
    const specialAnswer = `من رو **پویا عارف‌زاده** (Pouya Arefzadeh) طراحی و توسعه داده‌ست. ایشون یک توسعه‌دهندهٔ وب و مهندس هوش مصنوعی هستن با ۷ سال تجربهٔ متمرکز و تخصصی. 

📋 **اطلاعات شناسنامه‌ای:**
- تولد: ۱۳۸۷
- مکان: اردبیل - تهران

📞 **راه‌های ارتباطی:**
- وب‌سایت شخصی: pouya-web.vercel.app

📌 **خلاصهٔ اجرایی:**
توسعه‌دهندهٔ وب و مهندس هوش مصنوعی با ۷ سال تجربهٔ متمرکز و تخصصی (نه صرفاً کار با فریم‌ورک، بلکه طراحی معماری، بهینه‌سازی و پیاده‌سازی سیستم‌های هوشمند). زادهٔ اردبیل و فعال در اکوسیستم فنی تهران-اردبیل؛ پل زدن بین نیازهای بازار پایتخت و آرامشِ کار عمیق در شهرِ خودم. علاقه‌مند به سیستم‌های توصیه‌گر، پردازش زبان طبیعی و استقرارِ مدل در محیط‌های تولید (MLOps). روال کاری: کد تمیز، تست‌پذیری بالا، مستندسازیِ زنده و تحویلِ ارزشِ کسب‌وکاری، نه صرفاً خروجیِ تکنیکال.

🔗 نمونه‌کارها و مقالاتِ فنی من در وب‌سایت شخصی‌ام (pouya-web.vercel.app) قابل مشاهده است.`;

    for (const char of specialAnswer) {
      if (signal?.aborted) break;
      onChunk(char);
      await new Promise((r) => setTimeout(r, 10));
    }
    return specialAnswer;
  }
  // ===== پایان قانون ویژه =====

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ];

  // Try streaming endpoint first
  try {
    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        stream: true,
        seed: Math.floor(Math.random() * 100000),
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error('Streaming failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            onChunk(delta);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    if (fullText) return fullText;
  } catch (err) {
    if (signal?.aborted) throw err;
    // Fall through to non-streaming
  }

  // Fallback: non-streaming
  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        seed: Math.floor(Math.random() * 100000),
      }),
      signal,
    });

    if (!response.ok) throw new Error('API failed');
    const text = await response.text();

    // Simulate streaming for UX
    let fullText = '';
    const words = text.split(/(\s+)/);
    for (const word of words) {
      if (signal?.aborted) break;
      fullText += word;
      onChunk(word);
      await new Promise((r) => setTimeout(r, 12));
    }
    return fullText;
  } catch (err) {
    if (signal?.aborted) throw err;

    // Last resort: GET endpoint
    try {
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const prompt = encodeURIComponent(lastUserMessage);
      const response = await fetch(
        `https://text.pollinations.ai/${prompt}?model=${model}&system=${encodeURIComponent(SYSTEM_PROMPT)}`,
        { signal }
      );
      if (!response.ok) throw new Error('GET failed');
      const text = await response.text();
      let fullText = '';
      for (const char of text) {
        if (signal?.aborted) break;
        fullText += char;
        onChunk(char);
        await new Promise((r) => setTimeout(r, 8));
      }
      return fullText;
    } catch (fallbackErr) {
      if (signal?.aborted) throw fallbackErr;
      throw new Error('تمام روش‌های ارتباط با AI ناموفق بود. لطفاً دوباره تلاش کنید.');
    }
  }
}

// Generate image using Pollinations
export function generateAIImage(prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
}