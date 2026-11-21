export type DialectCode =
  | 'ar-MA' | 'ar-DZ' | 'ar-TN' | 'ar-LY' | 'ar-MR'
  | 'ar-EG'
  | 'ar-SA' | 'ar-AE' | 'ar-KW' | 'ar-QA' | 'ar-BH' | 'ar-OM'
  | 'ar-IQ' | 'ar-JO' | 'ar-LB' | 'ar-PS'
  | 'ar-fusha';

export type DialectGroup = 'maghreb' | 'egypt' | 'gulf' | 'levant' | 'fusha';

export interface Dialect {
  code: DialectCode;
  slug: string;        // URL segment for the landing page
  name: string;        // how the dialect is called, e.g. "الدارجة المغربية"
  short: string;       // chip label
  country: string;
  group: DialectGroup;
}

export const GROUP_LABELS: Record<DialectGroup, string> = {
  maghreb: 'المغرب العربي',
  egypt: 'مصر',
  gulf: 'الخليج',
  levant: 'الشام والعراق',
  fusha: 'الفصحى',
};

export const DIALECTS: Dialect[] = [
  { code: 'ar-MA', slug: 'morocco', name: 'الدارجة المغربية', short: 'المغربية', country: 'المغرب', group: 'maghreb' },
  { code: 'ar-DZ', slug: 'algeria', name: 'الدارجة الجزائرية', short: 'الجزائرية', country: 'الجزائر', group: 'maghreb' },
  { code: 'ar-TN', slug: 'tunisia', name: 'اللهجة التونسية', short: 'التونسية', country: 'تونس', group: 'maghreb' },
  { code: 'ar-LY', slug: 'libya', name: 'اللهجة الليبية', short: 'الليبية', country: 'ليبيا', group: 'maghreb' },
  { code: 'ar-MR', slug: 'mauritania', name: 'الحسانية', short: 'الموريتانية', country: 'موريتانيا', group: 'maghreb' },
  { code: 'ar-EG', slug: 'egypt', name: 'اللهجة المصرية', short: 'المصرية', country: 'مصر', group: 'egypt' },
  { code: 'ar-SA', slug: 'saudi-arabia', name: 'اللهجة السعودية', short: 'السعودية', country: 'السعودية', group: 'gulf' },
  { code: 'ar-AE', slug: 'uae', name: 'اللهجة الإماراتية', short: 'الإماراتية', country: 'الإمارات', group: 'gulf' },
  { code: 'ar-KW', slug: 'kuwait', name: 'اللهجة الكويتية', short: 'الكويتية', country: 'الكويت', group: 'gulf' },
  { code: 'ar-QA', slug: 'qatar', name: 'اللهجة القطرية', short: 'القطرية', country: 'قطر', group: 'gulf' },
  { code: 'ar-BH', slug: 'bahrain', name: 'اللهجة البحرينية', short: 'البحرينية', country: 'البحرين', group: 'gulf' },
  { code: 'ar-OM', slug: 'oman', name: 'اللهجة العمانية', short: 'العمانية', country: 'عُمان', group: 'gulf' },
  { code: 'ar-IQ', slug: 'iraq', name: 'اللهجة العراقية', short: 'العراقية', country: 'العراق', group: 'levant' },
  { code: 'ar-JO', slug: 'jordan', name: 'اللهجة الأردنية', short: 'الأردنية', country: 'الأردن', group: 'levant' },
  { code: 'ar-LB', slug: 'lebanon', name: 'اللهجة اللبنانية', short: 'اللبنانية', country: 'لبنان', group: 'levant' },
  { code: 'ar-PS', slug: 'palestine', name: 'اللهجة الفلسطينية', short: 'الفلسطينية', country: 'فلسطين', group: 'levant' },
  { code: 'ar-fusha', slug: 'fusha', name: 'العربية الفصحى', short: 'الفصحى', country: '', group: 'fusha' },
];

export const dialectByCode = (c: string) => DIALECTS.find((d) => d.code === c);
export const dialectBySlug = (s: string) => DIALECTS.find((d) => d.slug === s.toLowerCase());
