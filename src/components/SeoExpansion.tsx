import { CheckCircle, Shield, Zap, Globe, MessageCircle, Video, HelpCircle } from "lucide-react";

const SeoExpansion = () => {
  return (
    <div className="w-full bg-black text-zinc-300 py-16 px-6 md:px-12 lg:px-24 space-y-24 border-t border-zinc-900">
      
      {/* SEÇÃO 1: O QUE É (Foco: Omegle Alternative) */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          What is <span className="text-purple-500">Louuz</span>?
        </h2>
        
        <p className="text-lg md:text-xl leading-relaxed text-zinc-400">
          Louuz has established itself as a number one alternative to Omegle in 2026,
          but our existence goes far beyond filling a gap left by older platforms. 
          We are a next-generation network, designed for those who understand that 
          the true magic of the internet lies in the spontaneity of an unexpected encounter.
          Our main mission is to redefine online social interactions, creating a direct bridge 
          that brings people from all over the world closer together, breaking down geographical
         and cultural barriers so that a stranger becomes a new friend in a matter of seconds.

         Unlike services like OmeTV or Chatroulette, Louuz focuses on the purity of human connection through a modern, 
         safe, and completely anonymous space. We believe that to meet people authentically, you don't need forms or
         bureaucracy; therefore, our platform requires zero registration, no login, and remains completely ad-free. 
         We want you to immerse yourself in a video chat experience that is, above all, fun and engaging, offering the most 
         pleasant environment possible to expand your social circle.
        </p>
        
      </section>

      {/* SEÇÃO 2: POR QUE É MELHOR (Comparativo) */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Why is Louuz an alternative to <span className="text-pink-500 decoration-wavy underline">Omegle?</span>?
          </h3>
          <div className="space-y-4">
            <FeatureItem title="Instant Connection" desc="No loading screens. Click 'Start' and match instantly." />
            <FeatureItem title="No Login Required" desc="We don't ask for email, phone number, or Facebook." />
            <FeatureItem title="Next-Gen Design" desc="Modern Dark Mode interface optimized for Mobile and PC." />
            <FeatureItem title="Global Reach" desc="Talk to strangers from USA, Brazil, Europe, and Asia." />
          </div>
        </div>
        
        {/* Bloco de Texto Rico para SEO */}
        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-purple-500/30 transition-all">
          <h4 className="text-xl font-bold text-white mb-4">Safe Random Video Chat</h4>
          <p className="text-sm text-zinc-400 mb-4">
            Many users search for "sites like Omegle" but find platforms full of bots or strict bans. 
            At Louuz, we use advanced technology to connect real people. Our 
            <strong> cam-to-cam chat</strong> allows you to meet new friends, 
            practice languages, or just kill boredom anonymously.
          </p>
          <p className="text-sm text-zinc-400">
            If you miss the classic <strong>Omegle</strong> experience or want something faster than <strong>OmeTV</strong>, Louuz is the place to be.
            We are the "Omegle unblocked" solution you were looking for.
          </p>
        </div>
      </section>

      {/* SEÇÃO 3: FAQ (A ARMA SECRETA DO VOOZ) - NOVO! */}
      <section className="max-w-4xl mx-auto space-y-8">
        <h3 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
        
        <div className="grid gap-6">
            <FaqItem 
                question="Is Louuz a good Omegle alternative?" 
                answer="Yes! Since Omegle shut down, Louuz has become the fastest-growing alternative. We offer the same random video chat experience but with better design, mobile support, and faster connections."
            />
            <FaqItem 
                question="How to get unbanned from OmeTV?" 
                answer="If you are banned from OmeTV or other sites, you don't need a VPN. Just switch to Louuz! We are a fresh platform with fair moderation. Start chatting immediately without worrying about old bans."
            />
            <FaqItem 
                question="Is this video chat app safe?" 
                answer="Safety is our priority. Unlike the old Omegle, we have modern moderation systems. However, always remember to keep your personal information private when talking to strangers."
            />
        </div>
      </section>

      {/* SEÇÃO 4: LISTA DE KEYWORDS (A Caixa) */}
      <section className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/20 to-black p-8 rounded-3xl border border-purple-500/20 text-center">
        <h3 className="text-2xl font-bold text-white mb-8">Louuz is for everyone - Choose your mode</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <KeywordLink icon={<Video />} text="Random Video Chat" desc="Face-to-face with strangers" />
            <KeywordLink icon={<MessageCircle />} text="Text Chat Online" desc="Fast, lightweight & anonymous" />
            <KeywordLink icon={<Shield />} text="Anonymous Chat" desc="Your identity is protected" />
            <KeywordLink icon={<Zap />} text="Omegle Alternative" desc="The modern version of the classic" />
            <KeywordLink icon={<Globe />} text="Talk to Strangers" desc="Connect globally instantly" />
            <KeywordLink icon={<CheckCircle />} text="Sites like OmeTV" desc="Better moderation, no bans" />
        </div>

        <p className="mt-8 text-xs text-zinc-500 max-w-2xl mx-auto">
          Louuz is a premium online chat platform for users 18+. 
          We promote safe and respectful interactions. The best free random chat of 2026.
        </p>
      </section>

    </div>
  );
};

// Componentes auxiliares
const FeatureItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="mt-1 bg-green-500/10 p-2 rounded-lg h-fit text-green-500">
      <CheckCircle size={20} />
    </div>
    <div>
      <h4 className="text-white font-bold text-lg">{title}</h4>
      <p className="text-zinc-500 text-sm">{desc}</p>
    </div>
  </div>
);

const KeywordLink = ({ icon, text, desc }: { icon: any, text: string, desc: string }) => (
  <div className="bg-black/40 p-4 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-colors cursor-default group">
    <div className="flex items-center gap-3 mb-2 text-purple-400 group-hover:text-purple-300">
        {icon}
        <span className="font-bold text-white">{text}</span>
    </div>
    <p className="text-xs text-zinc-500">{desc}</p>
  </div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
    <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
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