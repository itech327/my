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

// Speaking mode: general Darija for explaining and talking, or Standard Arabic
// read with a Moroccan voice. Gemini follows it through a designed voice per mode
// and gender (tts/designed-voices.json); the style text reinforces it.
export type RegisterId = 'darija' | 'fusha';
export const REGISTERS: { id: RegisterId; label: string; hint: string; style: string }[] = [
  { id: 'darija', label: 'دارجة', hint: 'دارجة عامة، للشرح والتوضيح والتواصل.',
    style: 'Speak in natural, general Moroccan Darija that every Moroccan understands, like a native speaker from Morocco.' },
  { id: 'fusha', label: 'فصحى بنفَس مغربي', hint: 'عربية فصحى سليمة، بنطق ونبرة مغربية.',
    style: 'Read the text word for word exactly as written, in correct Modern Standard Arabic (Fusha). Do not change any word into Darija. Moroccan voice and intonation, like a Moroccan news anchor.' },
];
export const registerById = (id?: string | null) => REGISTERS.find((x) => x.id === id);

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

export function geminiStyle(delivery?: DeliveryId | null, pace?: PaceId | null, register?: RegisterId | null): string {
  const r = registerById(register) ?? REGISTERS[0];
  // Ear test 2026-11-23: the chatty "conversational" style pulled the male Fusha voice into Darija.
  // Fusha with that style (or none) uses the composed radio style instead.
  const wanted = deliveryById(delivery) ?? DELIVERIES[0];
  const d = r.id === 'fusha' && wanted.id === 'conversational' ? deliveryById('radio')! : wanted;
  // Ear test 2026-11-23: the redesigned Fusha voices already read slowly, so no extra slow pace.
  const p = paceById(pace ?? wanted.defaultPace);
  return [d.style.replace(DARIJA, r.style), p?.style].filter(Boolean).join(' ');
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
