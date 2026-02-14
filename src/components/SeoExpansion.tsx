import { Link } from "react-router-dom";
import { CheckCircle, Shield, Zap, Globe, MessageCircle, Video, HelpCircle, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  {
    to: "/video",
    icon: Video,
    label: "Video Chat",
    desc: "Face-to-face conversations in real time",
    color: "text-cyan-400",
    hoverBg: "hover:bg-cyan-500/10",
    borderHover: "hover:border-cyan-500/30",
  },
  {
    to: "/text-chat",
    icon: MessageCircle,
    label: "Text Chat",
    desc: "Simple, fast, and private messaging",
    color: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/30",
  },
  {
    to: "/anonymous-video-chat",
    icon: UserX,
    label: "Anonymous Chat",
    desc: "Talk without revealing your identity",
    color: "text-purple-400",
    hoverBg: "hover:bg-purple-500/10",
    borderHover: "hover:border-purple-500/30",
  },
  {
    to: "/omegle-alternative",
    icon: Zap,
    label: "Omegle Alternative",
    desc: "The modern version of classic Omegle chatting",
    color: "text-amber-400",
    hoverBg: "hover:bg-amber-500/10",
    borderHover: "hover:border-amber-500/30",
  },
  {
    to: "/talk-to-strangers",
    icon: Globe,
    label: "Talk to Strangers",
    desc: "Discover people and cultures from around the world",
    color: "text-pink-400",
    hoverBg: "hover:bg-pink-500/10",
    borderHover: "hover:border-pink-500/30",
  },
];

const SeoExpansion = () => {
  const { t } = useTranslation();

  return (
    // 1. Removi 'bg-black' para ficar transparente (o gradiente do pai aparecerá)
    // 2. Mudei a borda para 'border-white/10' para ficar mais sutil
    <div className="w-full bg-transparent text-zinc-300 py-16 px-6 md:px-12 lg:px-24 space-y-24 border-t border-white/10">
      
      {/* Bloco de Navegação: Choose How You Connect */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[#18181b] rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Choose How You Connect on <span className="text-purple-500">Louuz</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-4 p-4 rounded-xl border border-white/5 transition-all duration-200 ${item.hoverBg} ${item.borderHover} group`}
              >
                <div className={`shrink-0 p-2.5 rounded-lg bg-white/5 ${item.color} group-hover:scale-105 transition-transform`}>
                  <item.icon size={22} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block truncate">{item.label}</span>
                  <span className="text-sm text-zinc-500 block truncate">{item.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: O QUE É */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          {t('seo_exp.why_title')} <span className="text-purple-500">{t('seo_exp.louuz')}</span>
        </h2>
        
        <p className="text-lg md:text-xl leading-relaxed text-zinc-400">
          {t('seo_exp.response')}
        </p>
      </section>

      {/* SEÇÃO 2: POR QUE É MELHOR */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
            {t('seo_exp.alt_omegle')} <span className="text-pink-500 decoration-wavy underline">Omegle?</span>
          </h3>
          <div className="space-y-4">
            <FeatureItem title={t('seo_exp.features.f1_t')} desc={t('seo_exp.features.f1_d')} />
            <FeatureItem title={t('seo_exp.features.f2_t')} desc={t('seo_exp.features.f2_d')} />
            <FeatureItem title={t('seo_exp.features.f3_t')} desc={t('seo_exp.features.f3_d')} />
            <FeatureItem title={t('seo_exp.features.f4_t')} desc={t('seo_exp.features.f4_d')} />
          </div>
        </div>
        
        {/* Bloco de Texto Rico - Ajustei o fundo para ser semi-transparente (glass) */}
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
          <h4 className="text-xl font-bold text-white mb-4">{t('seo_exp.safe_title')}</h4>
          <p className="text-sm text-zinc-400 mb-4">
            {t('seo_exp.safe_p1')}
          </p>
          <p className="text-sm text-zinc-400">
            {t('seo_exp.safe_p2')}
          </p>
        </div>
      </section>

      {/* SEÇÃO 3: FAQ */}
      <section className="max-w-4xl mx-auto space-y-8">
        <h3 className="text-3xl font-bold text-white text-center mb-8">{t('seo_exp.faq_title')}</h3>
        
        <div className="grid gap-6">
            <FaqItem question={t('seo_exp.faq_q1')} answer={t('seo_exp.faq_a1')} />
            <FaqItem question={t('seo_exp.faq_q2')} answer={t('seo_exp.faq_a2')} />
            <FaqItem question={t('seo_exp.faq_q3')} answer={t('seo_exp.faq_a3')} />
        </div>
      </section>

      {/* SEÇÃO 4: LISTA DE KEYWORDS */}
      {/* Ajustei o gradiente deste card para combinar melhor com o fundo roxo global */}
      <section className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/40 to-black/40 p-8 rounded-3xl border border-purple-500/20 text-center backdrop-blur-md">
        <h3 className="text-2xl font-bold text-white mb-8">{t('seo_exp.footer_headline')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <KeywordLink icon={<Video />} text={t('seo_exp.k1_t')} desc={t('seo_exp.k1_d')} />
            <KeywordLink icon={<MessageCircle />} text={t('seo_exp.k2_t')} desc={t('seo_exp.k2_d')} />
            <KeywordLink icon={<Shield />} text={t('seo_exp.k3_t')} desc={t('seo_exp.k3_d')} />
            <KeywordLink icon={<Zap />} text={t('seo_exp.k4_t')} desc={t('seo_exp.k4_d')} />
            <KeywordLink icon={<Globe />} text={t('seo_exp.k5_t')} desc={t('seo_exp.k5_d')} />
            <KeywordLink icon={<CheckCircle />} text={t('seo_exp.k6_t')} desc={t('seo_exp.k6_d')} />
        </div>

        <p className="mt-8 text-xs text-zinc-500 max-w-2xl mx-auto">
          {t('seo_exp.disclaimer')}
        </p>
      </section>

    </div>
  );
};

// Componentes auxiliares
const FeatureItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg h-fit text-emerald-400">
      <CheckCircle size={20} />
    </div>
    <div>
      <h4 className="text-white font-bold text-lg">{title}</h4>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  </div>
);

const KeywordLink = ({ icon, text, desc }: { icon: any, text: string, desc: string }) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors cursor-default group hover:bg-white/10">
    <div className="flex items-center gap-3 mb-2 text-purple-400 group-hover:text-purple-300">
        {icon}
        <span className="font-bold text-white">{text}</span>
    </div>
    <p className="text-xs text-zinc-500">{desc}</p>
  </div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
        <h4 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
            <HelpCircle className="text-purple-500" size={20} />
            {question}
        </h4>
        <p className="text-zinc-400 text-sm leading-relaxed pl-8">
            {answer}
        </p>
    </div>
);

export default SeoExpansion;