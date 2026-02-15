import { Link } from "react-router-dom";
import { CheckCircle, HelpCircle } from "lucide-react";

const NAV_LINKS = [
  { to: "/video", label: "Video Chat", desc: "Face-to-face conversations in real time" },
  { to: "/text-chat", label: "Text Chat", desc: "Simple, fast, and private messaging" },
  { to: "/anonymous-video-chat", label: "Anonymous Chat", desc: "Talk without revealing your identity" },
  { to: "/omegle-alternative", label: "Omegle Alternative", desc: "The modern version of classic Omegle chatting" },
  { to: "/random-video-chat", label: "Random Video Chat", desc: "Connect live with strangers by video" },
  { to: "/talk-to-strangers", label: "Talk to Strangers", desc: "Discover people and cultures from around the world" },
];

const SeoExpansion = () => {
  return (
    <div className="w-full bg-transparent text-zinc-300 py-16 px-6 md:px-12 lg:px-24 space-y-24 border-t border-white/10">
      
      {/* Section 1: What is Louuz */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Why use <span className="text-purple-500">Louuz?</span>
        </h2>
        
        <p className="text-lg md:text-xl leading-relaxed text-zinc-400">
          Louuz has established itself as the #1 free Omegle alternative in 2026. We're a next-generation network designed for those who love the spontaneity of meeting strangers online. Our mission is to redefine online social interactions—connecting people worldwide and breaking down barriers so a stranger becomes a new friend in seconds. Unlike OmeTV or Chatroulette, Louuz focuses on pure human connection through a modern, safe, and completely anonymous space. No registration, no login, and no ads. Just free random video chat and text chat with real people.
        </p>
      </section>

      {/* Section 2: Why Better Than Omegle */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Why is Louuz an alternative to <span className="text-pink-500 decoration-wavy underline">Omegle?</span>
          </h3>
          <div className="space-y-4">
            <FeatureItem title="Instant Connection" desc="No loading screens. Click 'Start' and match instantly." />
            <FeatureItem title="No Login Required" desc="We don't ask for email, phone number, or social accounts." />
            <FeatureItem title="Next-Gen Design" desc="Modern Dark Mode interface optimized for Mobile and PC." />
            <FeatureItem title="Global Reach" desc="Talk to strangers from USA, Brazil, Europe, and Asia." />
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
          <h4 className="text-xl font-bold text-white mb-4">Free Random Chat & Anonymous Video</h4>
          <p className="text-sm text-zinc-400 mb-4">
            Many users search for "sites like Omegle" but find platforms full of bots or strict bans. At Louuz, we use advanced technology to connect real people.
          </p>
          <p className="text-sm text-zinc-400">
            If you miss the classic Omegle experience or want something faster than OmeTV, Louuz is the place. We're the Omegle alternative you've been looking for.
          </p>
        </div>
      </section>

      {/* Section 3: FAQ */}
      <section className="max-w-4xl mx-auto space-y-8">
        <h3 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
        
        <div className="grid gap-6">
            <FaqItem question="Is Louuz a good Omegle alternative?" answer="Yes! Since Omegle shut down, Louuz has become the fastest-growing alternative. We offer the same random video chat experience but with better design, mobile support, and faster connections." />
            <FaqItem question="How to get unbanned from OmeTV?" answer="If you are banned from OmeTV or other sites, you don't need a VPN. Just switch to Louuz! We are a fresh platform with fair moderation. Start chatting immediately without worrying about old bans." />
            <FaqItem question="Is this video chat app safe?" answer="Safety is our priority. Unlike the old Omegle, we have modern moderation systems. However, always remember to keep your personal information private when talking to strangers." />
        </div>
      </section>

      {/* Navigation Block - Choose How You Connect */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[#18181b] rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Choose How You Connect on <span className="text-purple-500">Louuz</span>
          </h2>
          <p className="text-[#d1d5db] text-base leading-relaxed mb-6">
            Louuz is for everyone. Our platform provides several communication methods—video chat, text chat, and anonymous chat—so you can connect with strangers the way that feels most comfortable.
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