// Delivery presets: one definition, translated per engine.
//  - open engine (F5-TTS): a reference tone (calm or lively clip) and a pace
//  - Gemini TTS: a style description in words
// Ideas from the competitor recon (replica/competitor-audiodarija.md); the
// wording here is our own.

export type DeliveryId = 'conversational' | 'ad' | 'radio' | 'story' | 'service';
export type PaceId = 'slow' | 'medium' | 'fast';

export interface Delivery {
  id: DeliveryId;
  label: string;
  hint: string;
  tone: 'calm' | 'lively';       // which reference clip the open engine uses
  defaultPace: PaceId;
  style: string;                 // for Gemini's speech_metadata.style
}

const DARIJA = 'Speak in natural Moroccan Darija, like a native speaker from Morocco.';

// Regional accents. Gemini follows them through a designed voice per region
// (tts/designed-voices.json); the style text only reinforces it.
export type AccentId = 'casa' | 'rabat' | 'north' | 'marrakech' | 'fes' | 'simple';
export const ACCENTS: { id: AccentId; label: string; hint: string; style: string; city: string }[] = [
  { id: 'casa', label: 'كازاوية', hint: 'عصرية، مفهومة فالمغرب كامل', style: 'with a modern Casablanca accent', city: 'الدار البيضاء' },
  { id: 'rabat', label: 'رباطية', hint: 'نقية وسلسة', style: 'with a smooth, clear Rabat accent', city: 'الرباط' },
  { id: 'north', label: 'شمالية', hint: 'طنجة وتطوان', style: 'with a northern Moroccan accent from Tangier and Tetouan', city: 'طنجة وتطوان' },
  { id: 'marrakech', label: 'مراكشية', hint: 'بهجاوية مرحة', style: 'with a cheerful Marrakech accent', city: 'مراكش' },
  { id: 'fes', label: 'فاسية', hint: 'أصيلة، مخارج واضحة', style: 'with a traditional Fes accent and very clear articulation', city: 'فاس' },
  { id: 'simple', label: 'بيضاء', hint: 'مبسطة للجميع', style: 'in simple, neutral Darija that every Moroccan understands', city: '' },
];
export const accentById = (id?: string | null) => ACCENTS.find((x) => x.id === id);

export const DELIVERIES: Delivery[] = [
  { id: 'conversational', label: 'حواري', hint: 'بحال إلا كتهضر مع صاحبك، بلا تكلف.', tone: 'calm', defaultPace: 'medium',
    style: `${DARIJA} Relaxed and friendly, like chatting with a close friend. Short natural breathing pauses.` },
  { id: 'ad', label: 'إعلان', hint: 'حماس وإيقاع سريع، للإعلانات والريلز.', tone: 'lively', defaultPace: 'fast',
    style: `${DARIJA} Energetic and enthusiastic, like a lively radio ad or a social media reel. Upbeat and punchy.` },
  { id: 'radio', label: 'إذاعي', hint: 'متزن وواثق، للأخبار وتقديم الشركات.', tone: 'calm', defaultPace: 'medium',
    style: `${DARIJA} Confident, clear and composed, like a professional radio presenter.` },
  { id: 'story', label: 'حكاية', hint: 'هادئ ومشوّق، للقصص والكتب الصوتية.', tone: 'calm', defaultPace: 'slow',
    style: `${DARIJA} A calm, warm storyteller with gentle suspense. Unhurried, with longer pauses between sentences.` },
  { id: 'service', label: 'خدمة الزبناء', hint: 'لطيف ومرحّب، للرسائل والردود.', tone: 'lively', defaultPace: 'medium',
    style: `${DARIJA} Kind, smiling and welcoming, like a helpful customer service agent.` },
];

export const PACES: { id: PaceId; label: string; speed: number; pauseScale: number; style: string }[] = [
  { id: 'slow', label: 'هادئة', speed: 0.85, pauseScale: 1.7, style: 'Speak slowly.' },
  { id: 'medium', label: 'متوسطة', speed: 0.95, pauseScale: 1.0, style: '' },
  { id: 'fast', label: 'سريعة', speed: 1.1, pauseScale: 0.7, style: 'Speak at a brisk, lively pace.' },
];

export const deliveryById = (id?: string | null) => DELIVERIES.find((d) => d.id === id);
export const paceById = (id?: string | null) => PACES.find((p) => p.id === id);

export function geminiStyle(delivery?: DeliveryId | null, pace?: PaceId | null, accent?: AccentId | null): string {
  const d = deliveryById(delivery) ?? DELIVERIES[0];
  const p = paceById(pace ?? d.defaultPace);
  const a = accentById(accent) ?? ACCENTS[0];
  return [d.style.replace('like a native speaker from Morocco.', `${a.style}, like a native speaker from Morocco.`), p?.style].filter(Boolean).join(' ');
}

// Ready-made Darija scripts, written for this product.
export const TEMPLATES: { id: string; label: string; delivery: DeliveryId; text: string }[] = [
  { id: 'ad', label: 'إعلان تخفيضات', delivery: 'ad',
    text: 'هاد السيمانة، التخفيضات وصلات حتى للنص! لبسة، صبابط، وكلشي اللي كتحتاجو. ما تضيعش الفرصة، العرض غير حتى للأحد.' },
  { id: 'welcome', label: 'رسالة ترحيب', delivery: 'service',
    text: 'مرحبا بيك! شكرا حيت اخترتينا. إلا كان عندك شي سؤال، حنا هنا باش نعاونوك فأي وقت.' },
  { id: 'reel', label: 'مقدمة ريلز', delivery: 'ad',
    text: 'واش عمرك جربتي هاد الطريقة؟ تبع معايا حتى للآخر، حيت النتيجة غادي تعجبك بزاف!' },
  { id: 'company', label: 'تقديم شركة', delivery: 'radio',
    text: 'كنقدمو ليكم حلول رقمية بسيطة وفعالة، كتعاون المقاولات المغربية باش تكبر وتوصل لزبناء جداد.' },
  { id: 'story', label: 'بداية حكاية', delivery: 'story',
    text: 'كان حتى كان، فواحد المدينة قديمة، كان عايش واحد الشيخ كيعرف حكايات بزاف. وكل عشية، كيجمعو عليه الدراري باش يسمعو.' },
];
