/**
 * The home page's live demo store (v2 design). Sample brands, products and
 * prices invented to show the work: nothing here is a client, and every place
 * it renders carries a visible "Live demo: a sample store" label (fix 6).
 *
 * The demo shows both languages on every page, so each text carries its
 * English and Arabic form here rather than in the locale files. Prices use
 * Western digits, as the rest of the Arabic site does.
 */

export type DemoLang = 'en' | 'ar';
export type DemoStyle = 'minimal' | 'bold' | 'luxe';
export type DemoDevice = 'desktop' | 'mobile';

type Bi = Record<DemoLang, string>;

export interface DemoProduct {
  name: Bi;
  price: number;
  tone: string;
  shade: string;
  radius: string;
  ratio: string;
}

export interface DemoTheme {
  url: string;
  name: Bi;
  kicker: Bi;
  hero: Bi;
  sub: Bi;
  products: DemoProduct[];
}

const SERIF_EN = "Georgia, 'Times New Roman', serif";
const SERIF_AR = "'Times New Roman', 'Traditional Arabic', serif";

/** CSS for each style: colours and type. Read by the demo's stylesheet. */
export const DEMO_STYLES: Record<DemoStyle, Record<string, string>> = {
  minimal: {
    '--d-bg': '#F7F5F0', '--d-ink': '#1B1A18', '--d-card': '#ECE7DE', '--d-tone': '#DCD3C4', '--d-shade': '#B9A88F',
    '--d-acc': '#1B1A18', '--d-acc-ink': '#F7F5F0', '--d-btn-r': '2px', '--d-shape-r': '50% 50% 12px 12px',
    '--d-line': 'rgba(0,0,0,.2)', '--d-font-en': 'var(--font-latin)', '--d-font-ar': 'var(--font-arabic-body)',
    '--d-weight': '300', '--d-stretch': '100%', '--d-tt': 'none', '--d-ls': '-0.02em', '--d-lh': '1.05',
  },
  bold: {
    '--d-bg': '#FF5A1F', '--d-ink': '#1A0E08', '--d-card': '#FFD9C7', '--d-tone': '#1A0E08', '--d-shade': '#FF5A1F',
    '--d-acc': '#1A0E08', '--d-acc-ink': '#FFD9C7', '--d-btn-r': '999px', '--d-shape-r': '14px 14px 30px 30px',
    '--d-line': 'rgba(0,0,0,.2)', '--d-font-en': 'var(--font-latin)', '--d-font-ar': 'var(--font-arabic-display)',
    '--d-weight': '900', '--d-stretch': '125%', '--d-tt': 'uppercase', '--d-ls': '-0.03em', '--d-lh': '0.9',
  },
  luxe: {
    '--d-bg': '#14110D', '--d-ink': '#E9DCC3', '--d-card': '#1F1A14', '--d-tone': '#2A2219', '--d-shade': '#C9A45C',
    '--d-acc': '#C9A45C', '--d-acc-ink': '#14110D', '--d-btn-r': '0', '--d-shape-r': '8px 8px 4px 4px',
    '--d-line': 'rgba(233,220,195,.3)', '--d-font-en': SERIF_EN, '--d-font-ar': SERIF_AR,
    '--d-weight': '400', '--d-stretch': '100%', '--d-tt': 'none', '--d-ls': '0', '--d-lh': '1.05',
  },
};

export const DEMO_THEMES: Record<DemoStyle, DemoTheme> = {
  minimal: {
    url: 'sable.store',
    name: { en: 'Sable', ar: 'سابل' },
    kicker: { en: 'Spring collection', ar: 'مجموعة الربيع' },
    hero: { en: 'Made slow. Made to last.', ar: 'صُنع بتأنٍّ، ليدوم طويلًا.' },
    sub: { en: 'Hand-thrown ceramics for everyday rituals.', ar: 'خزفيات مصنوعة يدويًا لطقوسك اليومية.' },
    products: [
      { name: { en: 'Vase', ar: 'مزهرية' }, price: 240, tone: '#E4DCCF', shade: '#C2B29A', radius: '50% 50% 8px 8px', ratio: '1/1.5' },
      { name: { en: 'Bowl', ar: 'وعاء' }, price: 120, tone: '#D9D2C6', shade: '#A99A84', radius: '0 0 50% 50%', ratio: '1.6/1' },
      { name: { en: 'Cup', ar: 'فنجان' }, price: 85, tone: '#E8E2D8', shade: '#BBAA92', radius: '6px 6px 40% 40%', ratio: '1/1.1' },
      { name: { en: 'Plate', ar: 'طبق' }, price: 95, tone: '#DED6CA', shade: '#B4A38B', radius: '50%', ratio: '1/1' },
    ],
  },
  bold: {
    url: 'kafa.coffee',
    name: { en: 'Kafa', ar: 'كافا' },
    kicker: { en: 'Fresh roast · weekly', ar: 'تحميص طازج · أسبوعيًا' },
    hero: { en: 'Coffee, loud.', ar: 'قهوة بصوت عالٍ.' },
    sub: { en: 'Specialty beans roasted in small batches.', ar: 'حبوب مختصة محمّصة بكميات صغيرة.' },
    products: [
      { name: { en: 'Espresso', ar: 'إسبريسو' }, price: 68, tone: '#FFD9C7', shade: '#1A0E08', radius: '10px 10px 24px 24px', ratio: '1/1.4' },
      { name: { en: 'Ethiopia', ar: 'إثيوبيا' }, price: 74, tone: '#1A0E08', shade: '#FF5A1F', radius: '10px 10px 24px 24px', ratio: '1/1.4' },
      { name: { en: 'Cold brew', ar: 'كولد برو' }, price: 22, tone: '#FFF1EA', shade: '#FF5A1F', radius: '40% 40% 8px 8px', ratio: '1/2' },
      { name: { en: 'Drip kit', ar: 'عدة التقطير' }, price: 189, tone: '#FFD9C7', shade: '#1A0E08', radius: '0 0 50% 50%', ratio: '1.2/1' },
    ],
  },
  luxe: {
    url: 'oudandco.com',
    name: { en: 'Oud & Co', ar: 'عود وشركاه' },
    kicker: { en: 'Maison de parfum', ar: 'دار عطور' },
    hero: { en: 'The scent of an evening.', ar: 'عطرُ أمسيةٍ لا تُنسى.' },
    sub: { en: 'Oud, amber and rose, blended in Taif.', ar: 'عود وعنبر وورد، ممزوجة في الطائف.' },
    products: [
      { name: { en: 'Oud Royal', ar: 'عود ملكي' }, price: 890, tone: '#231D16', shade: '#C9A45C', radius: '30% 30% 6px 6px', ratio: '1/1.4' },
      { name: { en: 'Amber Night', ar: 'ليل العنبر' }, price: 640, tone: '#2A2219', shade: '#8E6B3A', radius: '6px', ratio: '1/1.3' },
      { name: { en: 'Rose Taif', ar: 'ورد الطائف' }, price: 720, tone: '#231D16', shade: '#B98A7A', radius: '50% 50% 6px 6px', ratio: '1/1.5' },
      { name: { en: 'White Musk', ar: 'مسك أبيض' }, price: 450, tone: '#2A2219', shade: '#E9DCC3', radius: '6px 6px 30% 30%', ratio: '1/1.2' },
    ],
  },
};

/** Store chrome, per store language. */
export const DEMO_CHROME: Record<DemoLang, { links: string[]; cta: string; cart: string; best: string; all: string }> = {
  en: { links: ['Shop', 'Collections', 'Journal'], cta: 'Shop now', cart: 'Cart (2)', best: 'Bestsellers', all: 'View all' },
  ar: { links: ['المتجر', 'المجموعات', 'المدونة'], cta: 'تسوّق الآن', cart: 'السلة (2)', best: 'الأكثر مبيعًا', all: 'عرض الكل' },
};

export const demoPrice = (price: number, lang: DemoLang) => (lang === 'ar' ? `${price} ر.س` : `SAR ${price}`);

/** The autoplay tour: style, store language, device. */
export const DEMO_SEQUENCE: [DemoStyle, DemoLang, DemoDevice][] = [
  ['minimal', 'en', 'desktop'],
  ['minimal', 'ar', 'desktop'],
  ['bold', 'ar', 'mobile'],
  ['bold', 'en', 'mobile'],
  ['luxe', 'en', 'desktop'],
  ['luxe', 'ar', 'desktop'],
];

/** The bilingual slider's product page, in each language. */
export const DEMO_PRODUCT_PAGE = {
  en: {
    tag: 'New',
    crumb: 'Home / Fragrance / Oud Royal',
    name: 'Oud Royal',
    meta: 'Eau de parfum · 100 ml',
    price: 'SAR 890',
    desc: 'Smoky Cambodian oud softened with Taif rose and warm amber. Long-lasting, made for evenings.',
    sizes: ['50 ml', '100 ml'],
    add: 'Add to bag',
    arrow: '→',
    note: 'Free delivery across the GCC',
    font: SERIF_EN,
  },
  ar: {
    tag: 'جديد',
    crumb: 'الرئيسية / العطور / عود ملكي',
    name: 'عود ملكي',
    meta: 'ماء عطر · 100 مل',
    price: '890 ر.س',
    desc: 'عود كمبودي مدخّن يلطّفه ورد الطائف ودفء العنبر. ثبات طويل، مصنوع للأمسيات.',
    sizes: ['50 مل', '100 مل'],
    add: 'أضف إلى الحقيبة',
    arrow: '←',
    note: 'توصيل مجاني لدول الخليج',
    font: SERIF_AR,
  },
} as const;
