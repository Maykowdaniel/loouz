import React from 'react';
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';

// --- Ícones SVG Personalizados para Marcas ---
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.6853-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.87-2.97 6.37-1.85 1.5-4.29 2.15-6.63 1.81-2.34-.34-4.51-1.83-5.84-3.88-1.33-2.05-1.74-4.58-1.08-6.97.66-2.39 2.32-4.39 4.51-5.42 2.19-1.03 4.72-.97 6.85.12v4.2c-1.17-.66-2.55-.9-3.87-.67-1.32.23-2.49.98-3.26 2.1-.77 1.12-1.01 2.53-.67 3.85.34 1.32 1.16 2.45 2.31 3.19 1.15.74 2.59.93 3.89.5 1.3-.43 2.41-1.37 3.1-2.57.69-1.2.98-2.61.79-3.98V.02z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.249-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

// Componente de Ícone Social Individual
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300 p-2 hover:bg-white/5 rounded-full"
    aria-label={label}
  >
    {icon}
  </a>
);

const Footer = () => {
  //const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 py-8 relative z-50">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-6">
        
        {/* Ícones Sociais */}
        <div className="flex items-center gap-4 sm:gap-6">
          <SocialLink 
            href="https://discord.gg/yftMxpYc" 
            icon={<DiscordIcon className="w-6 h-6" />} 
            label="Discord" 
          />
          <SocialLink 
            href="https://www.instagram.com/louuzchat?igsh=MTRnc2syeThrdTVzYQ==" 
            icon={<Instagram className="w-6 h-6" />} 
            label="Instagram" 
          />
          <SocialLink 
            href="https://tiktok.com/@loouzchat" 
            icon={<TikTokIcon className="w-6 h-6" />} 
            label="TikTok" 
          />
          <SocialLink 
            href="https://twitter.com/louuz_" 
            icon={<XIcon className="w-5 h-5" />} // Ícone do X é ligeiramente menor visualmente
            label="X (Twitter)" 
          />
          {/* Link do Reddit em branco por enquanto */}
          <SocialLink 
            href="#" 
            icon={<RedditIcon className="w-6 h-6" />} 
            label="Reddit" 
          />
        </div>

<div className="w-full border-t border-white/5 my-6"></div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-600 uppercase tracking-widest font-semibold text-center max-w-4xl mx-auto">
          <Link to="/chat/brazil" className="hover:text-zinc-400 transition-colors">Chat Brazil</Link>
          <Link to="/chat/usa" className="hover:text-zinc-400 transition-colors">USA Video Chat</Link>
          <Link to="/chat/germany" className="hover:text-zinc-400 transition-colors">German Chat</Link>
          <Link to="/chat/india" className="hover:text-zinc-400 transition-colors">India Chat</Link>
          <Link to="/chat/anime" className="hover:text-zinc-400 transition-colors">Anime Talk</Link>
          <Link to="/chat/lgbtq" className="hover:text-zinc-400 transition-colors">LGBTQ+ Chat</Link>
          <Link to="/chat/gamers" className="hover:text-zinc-400 transition-colors">Gamer Chat</Link>
          <Link to="/chat/dating" className="hover:text-zinc-400 transition-colors">Dating Chat</Link>
        </div>
        
        {/* Links Legais e Copyright */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm mb-2">
            © {currentYear} Louuz. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-zinc-400">
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;