import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Layers, Info, HelpCircle } from "lucide-react";
import { seoPages, type SeoPageData } from "@/data/seoPages";

const SeoLandingPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pageData: SeoPageData | undefined = seoPages[pathname];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (pageData) {
      document.title = pageData.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", pageData.description);
      }
    }
  }, [pageData]);

  if (!pageData) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Efeitos de Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header com Menu */}
      <div className="absolute top-0 right-0 p-6 z-[60]">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/5 rounded-full h-14 w-14 transition-all relative z-50 group"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_5px_rgba(192,132,252,0.6)] group-hover:drop-shadow-[0_0_10px_rgba(192,132,252,1)] transition-all duration-300"
          >
            <path
              d="M4 7H20"
              stroke="#C084FC"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M4 12H20"
              stroke="#C084FC"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M12 17H20"
              stroke="#C084FC"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>

      {/* Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#18181b] border-t border-white/10 sm:border sm:rounded-[30px] rounded-t-[30px] shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
            <div
              className="flex justify-center pt-3 pb-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full cursor-pointer" />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <MenuItem
                icon={<Home size={20} />}
                label="Home"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/");
                }}
              />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <MenuItem
                icon={<Layers size={20} />}
                label="Salas (Rooms)"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/rooms");
                }}
              />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <MenuItem
                icon={<Info size={20} />}
                label="Sobre"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/about");
                }}
              />
            </div>
            <div className="h-6" />
          </div>
        </div>
      )}

      {/* Conteúdo SEO */}
      <main className="relative flex flex-col flex-grow pt-24 sm:pt-28 px-4 w-full max-w-4xl mx-auto z-10 pb-16">
        {/* Logo */}
        <div
          className="mb-8 cursor-pointer"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-2xl">
            lo<span className="text-cyan-400">uu</span>z
          </h1>
        </div>

        {/* H1 e Intro */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase leading-tight tracking-tighter drop-shadow-lg mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              {pageData.h1}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {pageData.intro}
          </p>
        </header>

        {/* Artigos */}
        <article className="space-y-16 border-t border-white/10 pt-16">
          {pageData.article.map((section, idx) => (
            <section
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {section.title}
              </h3>
              <div className="text-zinc-400 leading-relaxed space-y-4">
                {section.content.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* FAQ */}
        <section className="mt-20 space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid gap-6">
            {pageData.faq.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
              >
                <h4 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                  <HelpCircle
                    className="text-purple-500 shrink-0"
                    size={20}
                  />
                  {item.question}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed pl-8">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rodapé CTA */}
        <div className="mt-16 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/10"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 px-4 py-4 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all group"
  >
    <div className="text-zinc-500 group-hover:text-cyan-400 transition-colors">
      {icon}
    </div>
    <span className="text-lg font-medium tracking-tight">{label}</span>
  </button>
);

export default SeoLandingPage;
