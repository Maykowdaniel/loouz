import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terms of Service | Louuz";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* Background effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-white hover:text-cyan-400 transition-colors ml-auto"
          >
            lo<span className="text-cyan-400">uu</span>z
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 px-4 py-12">
        <article className="max-w-3xl mx-auto prose prose-invert prose-cyan prose-headings:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline">
          <h1>Terms of Service</h1>
          <p className="text-zinc-400 text-sm">Last updated: February 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Louuz (&quot;the platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the platform. Continued use constitutes acceptance of these terms and any future updates.
          </p>

          <h2>2. Age Requirement</h2>
          <p>
            <strong>You must be at least 18 years of age</strong> to use Louuz. By using this service, you confirm that you meet this age requirement. We do not knowingly allow minors on the platform. We are not responsible for the use of Louuz by anyone under 18.
          </p>

          <h2>3. User Responsibility</h2>
          <p>
            Louuz is an anonymous peer-to-peer chat platform. <strong>Users are solely responsible for their own behavior and content.</strong> We provide the technical infrastructure for connections but do not control, monitor, or endorse the content of individual conversations. You use the platform at your own risk.
          </p>

          <h2>4. Disclaimer of Liability for User-Generated Content</h2>
          <p>
            Content shared in chat (including text and video) is created and exchanged directly between users. We <strong>disclaim all liability</strong> for user-generated content in peer-to-peer chats. We do not pre-screen conversations and are not responsible for the actions, statements, or conduct of any user. Any reliance on content from other users is at your own risk.
          </p>

          <h2>5. Prohibited Conduct</h2>
          <p>
            You agree not to use Louuz to:
          </p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Harass, abuse, threaten, or intimidate others</li>
            <li>Share illegal, obscene, or harmful content</li>
            <li>Impersonate others or misrepresent your identity</li>
            <li>Engage in spam, advertising, or commercial solicitation</li>
            <li>Attempt to compromise the security or integrity of the platform</li>
          </ul>
          <p>
            Violation of these terms may result in immediate suspension or permanent ban of your access.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            Louuz is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of harmful content. We disclaim all warranties to the fullest extent permitted by law.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Louuz and its operators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to damages from user interactions, content exposure, or service interruptions.
          </p>

          <h2>8. Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes are effective immediately upon posting. Your continued use of Louuz after changes constitutes acceptance of the modified terms. We recommend reviewing this page periodically.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us through our website or social channels.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
