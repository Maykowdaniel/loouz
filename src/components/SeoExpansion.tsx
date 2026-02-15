import { Link } from "react-router-dom";
import { CheckCircle, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { to: "/video", label: "Video Chat", desc: "Face-to-face conversations in real time" },
  { to: "/text-chat", label: "Text Chat", desc: "Simple, fast, and private messaging" },
  { to: "/anonymous-video-chat", label: "Anonymous Chat", desc: "Talk without revealing your identity" },
  { to: "/omegle-alternative", label: "Omegle Alternative", desc: "The modern version of classic Omegle chatting" },
  { to: "/random-video-chat", label: "Random Video Chat", desc: "Connect live with strangers by video" },
  { to: "/talk-to-strangers", label: "Talk to Strangers", desc: "Discover people and cultures from around the world" },
];

const SeoExpansion = () => {
  const { t } = useTranslation();

  return (
    // 1. Removi 'bg-black' para ficar transparente (o gradiente do pai aparecerá)
    // 2. Mudei a borda para 'border-white/10' para ficar mais sutil
    <div className="w-full bg-transparent text-zinc-300 py-16 px-6 md:px-12 lg:px-24 space-y-24 border-t border-white/10">
      
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

      {/* Bloco de Navegação - Choose How You Connect (estilo lista, ao final) */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[#18181b] rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Choose How You Connect on <span className="text-purple-500">Louuz</span>
          </h2>
          <p className="text-[#d1d5db] text-base leading-relaxed mb-6">
            {t('seo_exp.connect_intro')}
          </p>
          <div className="space-y-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block hover:opacity-90 transition-opacity"
              >
                <span className="font-bold text-[#b764b7]">{item.label}</span>
                <span className="text-[#d1d5db]">: {item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
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