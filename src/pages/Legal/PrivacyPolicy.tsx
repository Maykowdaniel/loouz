import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Privacy Policy | Louuz";
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
          <h1>Privacy Policy</h1>
          <p className="text-zinc-400 text-sm">Last updated: February 2026</p>

          <h2>1. Introduction</h2>
          <p>
            Louuz (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates an anonymous random video and text chat platform. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect information when you use our service. <strong>Louuz does not require account creation or login.</strong> You can start chatting immediately without registering.
          </p>

          <h2>2. Information We Do Not Collect</h2>
          <p>
            Because Louuz is designed for anonymous, no-login usage, we intentionally minimize data collection:
          </p>
          <ul>
            <li>We do <strong>not</strong> store chat logs or message history.</li>
            <li>We do <strong>not</strong> record or store video streams.</li>
            <li>We do <strong>not</strong> collect names, email addresses, or other personal identifiers.</li>
          </ul>

          <h2>3. Information We Process</h2>
          <p>
            To provide and secure our service, we process the following:
          </p>
          <ul>
            <li><strong>IP addresses:</strong> We use IP addresses for moderation purposes (e.g., enforcing bans), country/region matching for connecting you with users in your area, and preventing abuse. We may retain IP-related data only for as long as necessary for these purposes.</li>
            <li><strong>Technical data:</strong> Connection metadata (e.g., session duration) may be processed temporarily to ensure the service operates correctly.</li>
          </ul>

          <h2>4. Cookies and Local Storage</h2>
          <p>
            We use cookies and browser local storage to save your preferences and improve your experience. This may include:
          </p>
          <ul>
            <li>Gender filter preferences (e.g., who you want to connect with)</li>
            <li>Country/region filter preferences</li>
            <li>Other interface settings that make your next visit more convenient</li>
          </ul>
          <p>
            These preferences are stored locally on your device. You can clear them at any time through your browser settings.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            We may use third-party services (e.g., for hosting, analytics, or moderation tools) that process data on our behalf. We require such parties to handle data in accordance with applicable privacy laws.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We do not permanently store chat content, video streams, or personal identifiers. Any retained data (such as IP-related records for moderation) is kept only for as long as necessary to enforce our policies and comply with legal obligations.
          </p>

          <h2>7. Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect the data we process. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>8. Children</h2>
          <p>
            Louuz is intended for users 18 years of age or older. We do not knowingly collect information from minors.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post changes on this page and update the &quot;Last updated&quot; date. Continued use of Louuz after changes constitutes acceptance of the updated policy.
          </p>

          <h2>10. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our website or social channels.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
