// src/services/ai.ts

import { Message, SearchResult } from '../types';
import { cache } from './cache';

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

// ===== اصلی‌ترین تابع: دریافت پاسخ با جستجوی هوشمند =====
export async function streamAIResponse(
  messages: Message[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // ===== قانون ویژه: شناسایی سوال درباره سازنده =====
  const creatorResponse = checkCreatorQuestion(lastMessage);
  if (creatorResponse) {
    return streamText(creatorResponse, onChunk, signal);
  }
  
  // ===== جستجوی هوشمند در منابع مختلف =====
  const searchResults = await smartSearch(lastMessage);
  
  // ===== ساخت پرامپت با اطلاعات جستجو شده =====
  const enhancedPrompt = buildEnhancedPrompt(lastMessage, searchResults);
  
  // ===== ارسال به API =====
  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: enhancedPrompt },
    ...messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ];
  
  // ===== تلاش با API‌های مختلف =====
  const apis = [
    () => callOpenAI(formattedMessages, model, onChunk, signal),
    () => callMistral(formattedMessages, model, onChunk, signal),
    () => callGroq(formattedMessages, model, onChunk, signal),
    () => callPollinations(formattedMessages, model, onChunk, signal),
  ];
  
  for (const apiCall of apis) {
    try {
      const result = await apiCall();
      if (result) return result;
    } catch (error) {
      console.warn('API call failed, trying next...', error);
      continue;
    }
  }
  
  throw new Error('تمامی روش‌های ارتباط با AI ناموفق بود. لطفاً دوباره تلاش کنید.');
}

// ===== توابع کمکی =====

function checkCreatorQuestion(text: string): string | null {
  const lower = text.toLowerCase();
  const keywords = [
    'سازنده', 'سازندت', 'سازنده‌ات', 'عقبه', 'پشت صحنه',
    'کی ساخته', 'چه کسی ساخته', 'توسعه‌دهنده', 'برنامه‌نویس',
    'دوست', 'پدر', 'ایجاد کننده', 'خالق', 'مالک',
    'who made you', 'who created you', 'your creator',
    'پویا', 'عارف', 'pooya', 'arefzadeh'
  ];
  
  const hasKeyword = keywords.some(k => lower.includes(k));
  const hasPhrase = 
    (lower.includes('کی') && (lower.includes('ساخت') || lower.includes('درست'))) ||
    (lower.includes('چه') && lower.includes('کسی') && (lower.includes('ساخت') || lower.includes('درست')));
  
  if (hasKeyword || hasPhrase) {
    return `من رو **پویا عارف‌زاده** (Pouya Arefzadeh) طراحی و توسعه داده‌ست. ایشون یک توسعه‌دهندهٔ وب و مهندس هوش مصنوعی هستن با ۷ سال تجربهٔ متمرکز و تخصصی. 

📋 **اطلاعات شناسنامه‌ای:**
- تولد: ۱۳۸۷
- مکان: اردبیل - تهران

📞 **راه‌های ارتباطی:**
- وب‌سایت شخصی: pouya-web.vercel.app

📌 **خلاصهٔ اجرایی:**
توسعه‌دهندهٔ وب و مهندس هوش مصنوعی با ۷ سال تجربهٔ متمرکز و تخصصی (نه صرفاً کار با فریم‌ورک، بلکه طراحی معماری، بهینه‌سازی و پیاده‌سازی سیستم‌های هوشمند). زادهٔ اردبیل و فعال در اکوسیستم فنی تهران-اردبیل؛ پل زدن بین نیازهای بازار پایتخت و آرامشِ کار عمیق در شهرِ خودم. علاقه‌مند به سیستم‌های توصیه‌گر، پردازش زبان طبیعی و استقرارِ مدل در محیط‌های تولید (MLOps). روال کاری: کد تمیز، تست‌پذیری بالا، مستندسازیِ زنده و تحویلِ ارزشِ کسب‌وکاری، نه صرفاً خروجیِ تکنیکال.

🔗 نمونه‌کارها و مقالاتِ فنی من در وب‌سایت شخصی‌ام (pouya-web.vercel.app) قابل مشاهده است.`;
  }
  return null;
}

async function smartSearch(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  // فقط از دانش داخلی استفاده کن (بدون ویکی‌پدیا)
  const knowledge = await searchKnowledge(query);
  results.push(...knowledge);
  
  // حذف موارد تکراری بر اساس عنوان
  const unique = new Map<string, SearchResult>();
  for (const result of results) {
    const key = result.title.substring(0, 50);
    if (!unique.has(key) || (result.relevance || 0) > (unique.get(key)?.relevance || 0)) {
      unique.set(key, result);
    }
  }
  
  return Array.from(unique.values()).slice(0, 7);
}

function buildEnhancedPrompt(query: string, searchResults: SearchResult[]): string {
  if (searchResults.length === 0) {
    return '⚠️ اطلاعات اضافی از منابع معتبر یافت نشد. لطفاً از دانش خودت استفاده کن.';
  }
  
  let prompt = '📚 **اطلاعات اضافی از منابع معتبر برای پاسخ‌دهی دقیق‌تر:**\n\n';
  
  for (let i = 0; i < Math.min(searchResults.length, 5); i++) {
    const result = searchResults[i];
    prompt += `### ${i + 1}. ${result.title}\n`;
    prompt += `📖 **منبع:** ${result.source}\n`;
    prompt += `📝 **متن:** ${result.content.substring(0, 1500)}\n`;
    if (result.url) {
      prompt += `🔗 **لینک:** ${result.url}\n`;
    }
    prompt += '\n---\n\n';
  }
  
  prompt += `\n💡 **دستورالعمل:** بر اساس اطلاعات بالا و دانش خودت به سوال کاربر پاسخ بده. اگر اطلاعات کافی نبود، از دانش خودت استفاده کن و به کاربر بگو که اطلاعات از کجا آمده است.`;
  
  return prompt;
}

// ===== توابع فراخوانی API =====

async function callOpenAI(
  messages: any[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  if (!ENV.OPENAI_API_KEY) throw new Error('OpenAI API key not found');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model === 'openai' ? 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
      messages,
      stream: true,
      max_tokens: ENV.MAX_TOKENS,
    }),
    signal,
  });
  
  if (!response.ok) throw new Error('OpenAI API error');
  return processStream(response, onChunk);
}

async function callMistral(
  messages: any[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  if (!ENV.MISTRAL_API_KEY) throw new Error('Mistral API key not found');
  
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-tiny',
      messages,
      stream: true,
      max_tokens: ENV.MAX_TOKENS,
    }),
    signal,
  });
  
  if (!response.ok) throw new Error('Mistral API error');
  return processStream(response, onChunk);
}

async function callGroq(
  messages: any[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  if (!ENV.GROQ_API_KEY) throw new Error('Groq API key not found');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages,
      stream: true,
      max_tokens: ENV.MAX_TOKENS,
    }),
    signal,
  });
  
  if (!response.ok) throw new Error('Groq API error');
  return processStream(response, onChunk);
}

async function callPollinations(
  messages: any[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(`${ENV.POLLINATIONS_URL}/openai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      seed: Math.floor(Math.random() * 100000),
    }),
    signal,
  });
  
  if (!response.ok) throw new Error('Pollinations API error');
  return processStream(response, onChunk);
}

// ===== پردازش استریم =====

async function processStream(
  response: Response,
  onChunk: (chunk: string) => void
): Promise<string> {
  if (!response.body) throw new Error('No response body');
  
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
  
  return fullText;
}

// ===== استریم کردن متن (برای پاسخ‌های آماده) =====

async function streamText(
  text: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  for (const char of text) {
    if (signal?.aborted) break;
    onChunk(char);
    await new Promise(r => setTimeout(r, 10));
  }
  return text;
}

// ===== تولید تصویر =====

export function generateAIImage(prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 100000);
  return `${ENV.POLLINATIONS_IMAGE_URL}/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
}