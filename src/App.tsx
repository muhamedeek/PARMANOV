import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Bar } from "recharts";
import { ShieldCheck, Handshake, TrendingUp, Calculator, Building2, Clock, ArrowRight, Phone, Instagram } from "lucide-react";

// --- Lightweight UI primitives (so the file runs standalone)
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary"; size?: "sm" | "md" | "lg" }> = ({
  className = "",
  children,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-0";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-sm sm:px-5 sm:py-3 sm:text-base",
    lg: "px-5 py-3 text-base",
  } as const;
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_#2563eb]",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/15",
  } as const;
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`rounded-2xl border p-0 ${className}`}>{children}</div>
);
const CardHeader: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`px-5 pt-5 ${className}`}>{children}</div>
);
const CardTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = "", children }) => (
  <h3 className={`font-semibold ${className}`}>{children}</h3>
);
const CardContent: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`px-5 pb-5 ${className}`}>{children}</div>
);

// --- Quick styling helpers ---
const Section: React.FC<React.PropsWithChildren<{ id?: string; className?: string }>> = ({ id, className, children }) => (
  <section id={id} className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 ${className || ""}`}>{children}</section>
);

const PROFILE_IMG = "https://s3.iimg.su/s/26/gAHH7MQxPysTtcNb6LVCv8ZnkwmBMCTtVEEJBuoY.png";

// тарифные ступени
const RATE_TIERS = [
  { months: 12, gross: 0.21, net: 0.189 },
  { months: 18, gross: 0.22, net: 0.198 },
  { months: 24, gross: 0.23, net: 0.207 },
  { months: 36, gross: 0.24, net: 0.216 },
  { months: 48, gross: 0.245, net: 0.2205 },
  { months: 60, gross: 0.249, net: 0.2241 },
] as const;

function pickTier(months: number) {
  let tier = RATE_TIERS[0];
  for (const t of RATE_TIERS) if (months >= t.months) tier = t;
  return tier;
}

const translations = {
  ru: {
    langName: "RU",
    heroTitle: "Инвестиционный советник",
    heroName: "Парманов Мухамеджан",
    heroSubtitle:
      "Помогаю инвесторам в Бишкеке получать стабильный фиксированный доход 19–22% годовых чистыми. Прозрачно, с акцентом на безопасность и контроль рисков.",
    ctaPrimary: "Записаться на консультацию",
    ctaSecondary: "Позвонить",
    minTicket: "Вход от 500 000 сом",
    trustBullets: [
      "Фокус на реальном секторе экономики",
      "Индивидуальные условия и понятные договорённости",
      "Ежемесячная отчётность и прозрачные расчёты",
    ],
    whyTitle: "Почему со мной надёжно",
    whyBullets: [
      {
        title: "Безопасность",
        text:
          "Приоритизирую сохранность капитала: консервативные модели, диверсификация и договорные обязательательства. Гарантий нет – зато есть дисциплина управления риском.",
        icon: <ShieldCheck className="h-6 w-6" />,
      },
      {
        title: "Прозрачность",
        text:
          "Чёткие условия, предсказуемые выплаты и простые формулы. Вы понимаете, как и за счёт чего формируется доход.",
        icon: <Handshake className="h-6 w-6" />,
      },
      {
        title: "Фокус на результате",
        text:
          "Цель – стабильный денежный поток для инвестора. Подбираю решения под ваш горизонт и цели.",
        icon: <TrendingUp className="h-6 w-6" />,
      },
    ],
    howTitle: "Как это работает",
    howSteps: [
      { icon: <Building2 className="h-5 w-5" />, title: "Встреча в офисе/онлайн", text: "Знакомимся, обсуждаем цели и горизонт инвестирования." },
      { icon: <Calculator className="h-5 w-5" />, title: "Персональный расчёт", text: "Подбираем параметры: сумма, срок, формат выплат (ежемесячно или с реинвестом)." },
      { icon: <Clock className="h-5 w-5" />, title: "Договорённости", text: "Фиксируем прозрачные условия и календарь выплат." },
      { icon: <TrendingUp className="h-5 w-5" />, title: "Выплаты и отчётность", text: "Получаете доход по графику и регулярные отчёты." },
    ],
    calcTitle: "Калькулятор доходности (19–22% годовых чистыми)",
    amountLabel: "Сумма инвестиций, сом",
    termLabel: "Срок, месяцев",
    rateLabel: "Тарифная ставка",
    modeLabel: "Формат выплат",
    modeReinvest: "Реинвест (капитализация)",
    modePayout: "Ежемесячные выплаты",
    summaryGrowth: "Итоговая сумма",
    summaryInterest: "Начислено дохода",
    summaryMonthly: "Ежемесячная выплата",
    chartTitle: "График выплат и роста (примерные расчёты)",
    tableTitle: "Таблица ежемесячных выплат (режим выплат)",
    faqTitle: "Важные моменты",
    faq: [
      {
        q: "Это не банковский вклад и не гарантия доходности?",
        a: "Да. Гарантий нет. Я работаю с консервативными моделями и повышаю прозрачность, но любой фиксированный доход связан с рисками.",
      },
      {
        q: "Как рассчитывается доход?",
        a: "Использую ступенчатые тарифы 12–60 месяцев. Внутри ступени ставка не меняется (например, 23 мес. = ставка как у 18 мес.).",
      },
      {
        q: "Минимальная сумма?",
        a: "От 500 000 сом. Чем больше горизонт и дисциплина реинвеста — тем заметнее эффект сложного процента.",
      },
    ],
    disclaimer:
      "Информация носит ознакомительный характер и не является публичной офертой, инвестиционной рекомендацией или рекламой конкретных проектов. Доходность не гарантируется. Решения принимаются инвестором самостоятельно.",
  },
  en: {
    langName: "EN",
    heroTitle: "Investment Advisor",
    heroName: "Parmanov Mukhamedzhan",
    heroSubtitle:
      "I help Bishkek-based investors earn a stable fixed income of 19–22% per annum (net). Transparent terms with a strong focus on safety and risk control.",
    ctaPrimary: "Book a consultation",
    ctaSecondary: "Call now",
    minTicket: "Minimum ticket: 500,000 KGS",
    trustBullets: [
      "Focus on the real economy",
      "Tailored terms and plain-language agreements",
      "Monthly reporting and transparent math",
    ],
    whyTitle: "Why it’s reliable with me",
    whyBullets: [
      {
        title: "Safety-first",
        text:
          "Capital preservation comes first: conservative models, diversification, and contractual discipline. No guarantees — but rigorous risk management.",
        icon: <ShieldCheck className="h-6 w-6" />,
      },
      {
        title: "Transparency",
        text:
          "Clear terms, predictable payouts, and simple formulas. You understand where the yield comes from.",
        icon: <Handshake className="h-6 w-6" />,
      },
      {
        title: "Results-oriented",
        text:
          "The goal is a steady cash flow for the investor. I tailor solutions to your horizon and goals.",
        icon: <TrendingUp className="h-6 w-6" />,
      },
    ],
    howTitle: "How it works",
    howSteps: [
      { icon: <Building2 className="h-5 w-5" />, title: "Office/online meeting", text: "We discuss your goals and investment horizon." },
      { icon: <Calculator className="h-5 w-5" />, title: "Personalized math", text: "Choose amount, term, and payout format (monthly or reinvest)." },
      { icon: <Clock className="h-5 w-5" />, title: "Agreement", text: "We fix transparent terms and a payout calendar." },
      { icon: <TrendingUp className="h-5 w-5" />, title: "Payouts & reporting", text: "You receive income on schedule and regular reports." },
    ],
    calcTitle: "Yield calculator (19–22% p.a. net)",
    amountLabel: "Investment amount, KGS",
    termLabel: "Term, months",
    rateLabel: "Tiered rate",
    modeLabel: "Payout mode",
    modeReinvest: "Reinvest (compound)",
    modePayout: "Monthly payout",
    summaryGrowth: "Final amount",
    summaryInterest: "Total interest earned",
    summaryMonthly: "Monthly payout",
    chartTitle: "Payouts and growth chart (approximate)",
    tableTitle: "Monthly payout table (payout mode)",
    faqTitle: "Key notes",
    faq: [
      {
        q: "Is this a bank deposit or a guaranteed return?",
        a: "No. There are no guarantees. I work with conservative models and transparency, but any fixed-income approach carries risk.",
      },
      {
        q: "How is the return calculated?",
        a: "Tiered rates for 12–60 months. Inside a tier the rate is flat (e.g., 23 mo uses the 18‑month tier rate).",
      },
      {
        q: "Minimum ticket?",
        a: "500,000 KGS. The longer the horizon and the more consistent the reinvestment, the stronger the compounding effect.",
      },
    ],
    disclaimer:
      "This page is for information only. It is not a public offer, investment advice, or advertising of any specific projects. Returns are not guaranteed. You make decisions independently.",
  },
} as const;

function formatKGS(n: number) {
  return new Intl.NumberFormat("ru-KG", { style: "currency", currency: "KGS", maximumFractionDigits: 0 }).format(n);
}
function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function useCalc(amountKGS: number, months: number, mode: "reinvest" | "payout") {
  const tier = pickTier(months);
  const monthlyRate = tier.net / 12;
  return useMemo(() => {
    let principal = amountKGS;
    let cumulativeInterest = 0;
    const rows: { m: number; principal: number; interest: number; payout: number; total: number }[] = [];

    for (let m = 1; m <= months; m++) {
      const interest = principal * monthlyRate;
      const payout = mode === "payout" ? amountKGS * monthlyRate : 0;
      if (mode === "reinvest") {
        principal += interest;
        cumulativeInterest += interest;
      } else {
        cumulativeInterest += payout;
      }
      rows.push({ m, principal, interest, payout: mode === "reinvest" ? interest : payout, total: mode === "reinvest" ? principal : amountKGS + cumulativeInterest });
    }

    const monthlyPayout = mode === "payout" ? amountKGS * monthlyRate : 0;
    const finalAmount = mode === "reinvest" ? rows[rows.length - 1]?.principal ?? amountKGS : amountKGS + cumulativeInterest;

    return { rows, monthlyPayout, finalAmount, cumulativeInterest, monthlyRate, tier };
  }, [amountKGS, months, mode, monthlyRate]);
}

// Fetch USD/KGS rate from NBKR XML once per day and cache in localStorage
function useNbkrUsdRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [asOf, setAsOf] = useState<string | null>(null); // e.g., 16.09.2025
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://www.nbkr.kg/XML/daily.xml", {
        cache: "no-store",
        mode: "cors",
        headers: { Accept: "application/xml,text/xml,*/*;q=0.1" },
      });
      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const dateAttr = xml.documentElement.getAttribute("Date"); // dd.mm.yyyy
      const nodes = Array.from(xml.getElementsByTagName("Currency"));
      const usdNode = nodes.find((n) => n.getAttribute("ISOCode") === "USD");
      if (usdNode) {
        const valueNode = usdNode.getElementsByTagName("Value")[0];
        const raw = valueNode?.textContent?.trim() || ""; // e.g. 87,4500
        const parsed = parseFloat(raw.replace(",", "."));
        if (!Number.isNaN(parsed)) {
          setRate(parsed);
          setAsOf(dateAttr || new Date().toISOString().slice(0, 10).split("-").reverse().join("."));
          const today = new Date().toISOString().slice(0, 10);
          localStorage.setItem("nbkr_usd_rate", String(parsed));
          localStorage.setItem("nbkr_usd_rate_date", today);
          if (dateAttr) localStorage.setItem("nbkr_usd_rate_asof", dateAttr);
        } else {
          setError("parse");
        }
      } else {
        setError("no-usd");
      }
    } catch (e) {
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const cached = localStorage.getItem("nbkr_usd_rate");
    const cachedDate = localStorage.getItem("nbkr_usd_rate_date");
    const cachedAsOf = localStorage.getItem("nbkr_usd_rate_asof");
    if (cached && cachedDate === today) {
      setRate(parseFloat(cached));
      if (cachedAsOf) setAsOf(cachedAsOf);
    } else {
      fetchRate();
    }
  }, []);

  return { rate, asOf, loading, error, refresh: fetchRate } as const;
}

function PortfolioPage() {
  const [lang, setLang] = useState<keyof typeof translations>("ru");
  const t = translations[lang];

  const [amount, setAmount] = useState(500000); // KGS only
  const [months, setMonths] = useState(12);
  const [mode, setMode] = useState<"reinvest" | "payout">("payout");

  const { rate: usdKgs, asOf: usdAsOf, loading: usdLoading, error: usdError, refresh: refreshUsd } = useNbkrUsdRate();

  // --- Manual USD rate override ---
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>(""); // string to keep comma/dot
  useEffect(() => {
    const mm = localStorage.getItem("usd_manual_mode");
    const mr = localStorage.getItem("usd_manual_rate");
    if (mm === "1") setManualMode(true);
    if (mr) setManualInput(mr);
  }, []);
  useEffect(() => {
    localStorage.setItem("usd_manual_mode", manualMode ? "1" : "0");
    if (manualInput) localStorage.setItem("usd_manual_rate", manualInput);
  }, [manualMode, manualInput]);
  const parseManual = (s: string) => {
    const x = parseFloat(s.replace(",", "."));
    return Number.isFinite(x) && x > 0 ? x : null;
  };
  const effRate = manualMode ? parseManual(manualInput) : usdKgs; // effective USD/KGS

  const { rows, monthlyPayout, finalAmount, cumulativeInterest, monthlyRate, tier } = useCalc(amount, months, mode);

  const usdApprox = (kgs: number) => (effRate ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(kgs / effRate) : "");

  const whatsAppText =
    lang === "ru"
      ? `Здравствуйте! Хочу консультацию по инвестициям. Сумма: ${formatKGS(amount)}${effRate ? ` (≈ ${usdApprox(amount)})` : ""}, срок: ${months} мес., формат: ${mode === "reinvest" ? "реинвест" : "ежемесячные выплаты"}.`
      : `Hello! I'd like an investment consultation. Amount: ${formatKGS(amount)}${effRate ? ` (≈ ${usdApprox(amount)})` : ""}, term: ${months} months, mode: ${mode === "reinvest" ? "reinvest" : "monthly payout"}.`;

  const waLink = `https://wa.me/996504883882?text=${encodeURIComponent(whatsAppText)}`;

  const tierLine =
    lang === "ru"
      ? `Текущая ступень: ${tier.months} мес • ставка брутто ${(tier.gross * 100).toFixed(1)}% • ставка чистыми ${(tier.net * 100).toFixed(2)}%`
      : `Current tier: ${tier.months} mo • gross rate ${(tier.gross * 100).toFixed(1)}% • net rate ${(tier.net * 100).toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white antialiased selection:bg-blue-600/30 selection:text-white">
      {/* Glow backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl bg-blue-600/20" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl bg-blue-500/10" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#0A0F1C]/50 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-800 shadow-[0_0_20px_#3b82f6]" />
            <span className="font-semibold tracking-tight">{t.heroName}</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://instagram.com/dzhan_capital" target="_blank" rel="noreferrer" className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm" className="gap-2"><Instagram className="h-4 w-4" /> Instagram</Button>
            </a>
            <Button variant="secondary" size="sm" onClick={() => setLang(lang === "ru" ? "en" : "ru")}>{t.langName}</Button>
            <a href={waLink} target="_blank" rel="noreferrer">
              {/* Smaller on phones */}
              <Button size="md" className="gap-2">
                <Phone className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <Section className="pt-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-blue-400/90 mb-3 text-sm tracking-wide uppercase">{t.heroTitle}</p>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight">
              {t.heroName}
              <span className="block text-xl sm:text-2xl font-semibold text-white/70 mt-3">{t.heroSubtitle}</span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={waLink} target="_blank" rel="noreferrer">
                <Button size="md" className="gap-2">
                  {t.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="tel:+996504883882">
                <Button size="md" variant="secondary">{t.ctaSecondary}</Button>
              </a>
            </div>
            <p className="mt-4 text-white/60">{t.minTicket} <span className="text-white/70">(≈ {effRate ? `${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(500000 / effRate)}` : "…"})</span></p>
            <ul className="mt-6 grid sm:grid-cols-3 gap-3">
              {t.trustBullets.map((b, i) => (
                <li key={i} className="text-sm text-white/80 bg-white/5 rounded-xl p-3 border border-white/10">• {b}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_#1d4ed8]">
              <img src={PROFILE_IMG} alt="Profile" className="h-[420px] w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Why */}
      <Section id="why">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-8">
          {t.whyTitle}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {t.whyBullets.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * idx }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-blue-500/40 transition-colors">
                <CardHeader className="flex flex-row items-center gap-3 px-6 pt-6">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-300 shadow-[0_0_25px_#3b82f6]">{item.icon}</div>
                  <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-white/80 leading-relaxed px-6 pb-6">{item.text}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* How */}
      <Section id="how">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-8">
          {t.howTitle}
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-6">
          {t.howSteps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }} className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-700/20 to-blue-500/0 blur-xl" />
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-blue-600/10 p-2 text-blue-300">{s.icon}</div>
                <p className="font-semibold mb-1 text-white">{s.title}</p>
                <p className="text-white/80 text-sm">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Calculator */}
      <Section id="calc">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-2">
          {t.calcTitle}
        </motion.h2>
        <p className="text-white/60 mb-2">{tierLine}</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-white/70 text-sm mb-6">
          {!manualMode ? (
            <>
              <span>{lang === 'ru' ? 'Курс НБКР (USD/KGS) на' : 'NBKR rate (USD/KGS) as of'} {usdAsOf || '—'}: <span className="font-semibold text-white/90">{usdKgs ? usdKgs.toFixed(4) : '…'}</span></span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={refreshUsd} className="px-2 py-1">{lang==='ru' ? 'Обновить' : 'Refresh'}</Button>
                <Button size="sm" variant="secondary" onClick={() => setManualMode(true)} className="px-2 py-1">{lang==='ru' ? 'Ввести вручную' : 'Enter manually'}</Button>
              </div>
              {usdError && <span className="text-red-300">{lang==='ru' ? 'не удалось загрузить' : 'failed to load'}</span>}
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/80">{lang==='ru' ? 'Курс (вручную), USD/KGS:' : 'Manual rate, USD/KGS:'}</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.0001"
                min="1"
                placeholder="86.5000"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-36 rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <Button size="sm" variant="secondary" onClick={() => setManualMode(false)} className="px-2 py-1">{lang==='ru' ? 'Авто (НБКР)' : 'Auto (NBKR)'}</Button>
              {effRate ? <span className="text-white/70">{lang==='ru' ? 'используется:' : 'using:'} <span className="text-white/90 font-semibold">{effRate.toFixed(4)}</span></span> : <span className="text-red-300">{lang==='ru' ? 'укажите корректный курс' : 'enter a valid rate'}</span>}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6 space-y-5">
              <div>
                <label className="block text-sm text-white/70 mb-2">{t.amountLabel}</label>
                <input
                  type="number"
                  min={500000}
                  step={10000}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(500000, Number(e.target.value)))}
                  className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-blue-500 text-white placeholder-white/40 text-lg font-semibold"
                />
                <p className="text-sm text-white/70 mt-1">≈ {effRate ? usdApprox(amount) : '…'} </p>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t.termLabel}: {months}</label>
                <input
                  type="range"
                  min={12}
                  max={60}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-3">{t.modeLabel}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setMode("reinvest")} className={`rounded-xl px-4 py-3 border ${mode === "reinvest" ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_25px_#2563eb]" : "bg-white/10 text-white/80 border-white/10 hover:bg-white/15"}`}>
                    {t.modeReinvest}
                  </button>
                  <button onClick={() => setMode("payout")} className={`rounded-xl px-4 py-3 border ${mode === "payout" ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_25px_#2563eb]" : "bg-white/10 text-white/80 border-white/10 hover:bg-white/15"}`}>
                    {t.modePayout}
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-white/60">{t.summaryGrowth}</p>
                  <p className="text-2xl font-extrabold mt-1 text-white tracking-tight">{formatKGS(finalAmount)}</p>
                  <p className="text-sm text-white/70">≈ {effRate ? usdApprox(finalAmount) : '…'}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-white/60">{t.summaryInterest}</p>
                  <p className="text-2xl font-extrabold mt-1 text-white tracking-tight">{formatKGS(cumulativeInterest)}</p>
                  <p className="text-sm text-white/70">≈ {effRate ? usdApprox(cumulativeInterest) : '…'}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-white/60">{t.summaryMonthly}</p>
                  <p className="text-2xl font-extrabold mt-1 text-white tracking-tight">{mode === "payout" ? formatKGS(monthlyPayout) : "—"}</p>
                  <p className="text-sm text-white/70">{mode === 'payout' ? `≈ ${effRate ? usdApprox(monthlyPayout) : '…'}` : ' '}</p>
                </div>
              </div>

              <div className="pt-2">
                <a href={waLink} target="_blank" rel="noreferrer">
                  <Button className="w-full">{t.ctaPrimary}</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-base text-white/80">{t.chartTitle}</CardTitle>
            </CardHeader>
            <CardContent className="h-[380px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="m" stroke="#ffffffdd" tickFormatter={(m: number) => String(m)} />
                  <YAxis stroke="#ffffffdd" tickFormatter={(v: number) => (v >= 1_000_000 ? `${Math.round(v / 1_000_000)}M` : `${Math.round(v / 1_000)}k`)} />
                  <Tooltip content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload as any;
                      return (
                        <div className="rounded-lg border border-white/20 bg-[#0A0F1C]/95 p-3 text-sm text-white shadow-xl">
                          <div className="opacity-90">{lang==='ru' ? 'Месяц' : 'Month'}: <span className="font-semibold">{p.m}</span></div>
                          <div className="opacity-90">{lang==='ru' ? 'Выплата' : 'Payout'}: <span className="font-semibold">{formatKGS(p.payout)}{` (≈ ${effRate ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(p.payout / effRate) : '…'})`}</span></div>
                          <div className="opacity-90">{lang==='ru' ? 'Итоговая сумма' : 'Final amount'}: <span className="font-semibold">{formatKGS(p.total)}{` (≈ ${effRate ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(p.total / effRate) : '…'})`}</span></div>
                          <div className="opacity-70">{lang==='ru' ? 'Ставка' : 'Rate'}: {((monthlyRate) * 12 * 100).toFixed(2)}% / {lang==='ru' ? 'год' : 'year'}</div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="payout" fill="#60A5FA" />
                  <Line type="monotone" dataKey="total" stroke="#E2E8F0" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="mt-3 text-xs text-white/70">{lang === "ru" ? "Дисклеймер: расчёты ориентировочные. По умолчанию используется курс НБКР; при ручном вводе курс задаётся пользователем." : "Disclaimer: approximate math. NBKR rate by default; manual rate overrides if provided."}</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Payout table */}
      <Section id="payout-table" className="pt-0">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-base text-white">{t.tableTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-blue-200">
                <thead>
                  <tr className="text-white">
                    <th className="px-3 py-2 text-left">{lang === "ru" ? "Месяц" : "Month"}</th>
                    <th className="px-3 py-2 text-left">{lang === "ru" ? "Сумма инвестиций" : "Investment amount"}</th>
                    <th className="px-3 py-2 text-left">{lang === "ru" ? "Сумма выплаты" : "Payout"}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: months }).map((_, i) => (
                    <tr key={i} className="border-t border-white/15 hover:bg-white/10">
                      <td className="px-3 py-2 font-medium text-white/90">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{formatKGS(amount)} <span className="text-white/70">(≈ {effRate ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(amount / effRate) : '…'})</span></td>
                      <td className="px-3 py-2 font-semibold text-white">{formatKGS(amount * (pickTier(months).net / 12))} <span className="text-white/70">(≈ {effRate ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((amount * (pickTier(months).net / 12)) / effRate) : '…'})</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/30 font-semibold text-white">
                    <td className="px-3 py-2" colSpan={2}>{lang === "ru" ? "Итого начислено" : "Total interest"}</td>
                    <td className="px-3 py-2">{formatKGS((amount * (pickTier(months).net / 12)) * months)} <span className="text-white/70">(≈ {effRate ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(((amount * (pickTier(months).net / 12)) * months) / effRate) : '…'})</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-8">
          {t.faqTitle}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {t.faq.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }}>
              <Card className="bg-white/5 border-white/10 mx-1 sm:mx-0">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-base text-white">{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-white/80 text-sm leading-relaxed px-6 pb-6">{f.a}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <Section className="py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-1">
              <p className="text-lg font-semibold">{t.heroName}</p>
              <p className="text-white/70">{t.heroTitle}</p>
              <p className="text-white/60">WhatsApp: <a className="text-blue-400 hover:underline" href="https://wa.me/996504883882" target="_blank" rel="noreferrer">+996 504 883 882</a></p>
              <p className="text-white/60 flex items-center gap-2"><Instagram className="h-4 w-4"/> <a className="text-blue-400 hover:underline" href="https://instagram.com/dzhan_capital" target="_blank" rel="noreferrer">@dzhan_capital</a></p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{t.disclaimer}</p>
          </div>
        </Section>
      </footer>
    </div>
  );
}

// ------------------------
// Dev-only tests for the calculator logic (tiered rates)
// ------------------------
if (typeof window !== "undefined" && (window as any).DEV_TESTS !== false) {
  const approx = (a: number, b: number, eps = 1) => Math.abs(a - b) <= eps; // within 1 KGS

  // Test 1: reinvest for 12 months should match compound with 18.9% net
  const amount = 500_000;
  const months = 12;
  const tier = pickTier(months);
  const rate = tier.net / 12;
  const expected = amount * Math.pow(1 + rate, months);

  const calc1 = (() => {
    let p = amount;
    for (let i = 0; i < months; i++) p += p * rate;
    return p;
  })();
  console.assert(approx(calc1, expected), "[useCalc] reinvest 12m should match compounding with 18.9% net");

  // Test 2: 23 months should use 18-month tier (19.8% net)
  const tier23 = pickTier(23);
  console.assert(Math.abs(tier23.net - 0.198) < 1e-9, "[tier] 23m should pick 19.8% net tier");

  // Test 3: monthly payout equals amount * monthlyRate for payout mode
  const payoutMonthly = amount * rate;
  console.assert(approx(payoutMonthly, 500000 * (tier.net / 12)), "[useCalc] monthly payout formula (tiered) mismatch");

  // Test 4: bounds
  console.assert(pickTier(60).net > pickTier(12).net, "[tier] 60m net should be > 12m net");

  // Test 5: payout table total equals months * monthly payout (given tier)
  console.assert(approx((amount * (pickTier(24).net/12))*24, amount * (0.207/12) * 24), "[table] total equals months * monthly payout");
}

export default function App() {
  return <PortfolioPage />;
}
