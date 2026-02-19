import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const CommunityGuidelines = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Community Guidelines | Louuz";
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
          <h1>Community Guidelines</h1>
          <p className="text-zinc-400 text-sm">Last updated: February 2026</p>

          <h2>1. Our Commitment</h2>
          <p>
            Louuz is an anonymous random video and text chat platform. We aim to provide a safe, respectful environment for meeting new people. These Community Guidelines outline expected behavior and the consequences of violations. By using Louuz, you agree to follow these guidelines.
          </p>

          <h2>2. Zero Tolerance</h2>
          <p>
            We have <strong>zero tolerance</strong> for the following. Violations will result in immediate action, including permanent IP bans:
          </p>
          <ul>
            <li><strong>Nudity and sexual content:</strong> Do not expose yourself or share explicit material. This includes video and text.</li>
            <li><strong>Harassment:</strong> Do not bully, threaten, intimidate, or repeatedly contact users who have disconnected or asked you to stop.</li>
            <li><strong>Spam:</strong> Do not promote links, products, services, or external platforms. No repetitive or automated messaging.</li>
            <li><strong>Illegal activities:</strong> Do not engage in or promote any illegal activity, including fraud, violence, or exploitation.</li>
          </ul>

          <h2>3. Reporting and Skipping</h2>
          <p>
            If you encounter someone who violates these guidelines:
          </p>
          <ul>
            <li><strong>Skip:</strong> Use the skip button to disconnect and move to a new chat. You are never obligated to stay in a conversation.</li>
            <li><strong>Report:</strong> Use the report button to flag the user. Reports are reviewed by our moderation team and automated systems.</li>
          </ul>

          <h2>4. Enforcement</h2>
          <p>
            Our automated systems and moderators actively monitor the platform for violations. When we identify or receive reports of policy breaches, we may:
          </p>
          <ul>
            <li>Issue a temporary or <strong>permanent IP ban</strong> to prevent repeat offenders from accessing the service</li>
            <li>Block access from specific regions or devices when necessary</li>
          </ul>
          <p>
            Bans are enforced at the IP level. We do not store accounts or personal identifiers, so enforcement focuses on technical identifiers used to maintain platform safety.
          </p>

          <h2>5. Be Respectful</h2>
          <p>
            Beyond the zero-tolerance rules, we encourage users to be respectful and kind. Treat others as you would like to be treated. Disagreements are normal—handling them civilly makes the experience better for everyone.
          </p>

          <h2>6. Your Safety</h2>
          <p>
            Never share personal information (e.g., full name, address, phone number, passwords) with strangers. Louuz is designed for anonymous chat—keep it that way. If someone makes you uncomfortable, skip or report and move on.
          </p>

          <h2>7. Changes</h2>
          <p>
            We may update these Community Guidelines from time to time. Changes are effective upon posting. Continued use of Louuz constitutes acceptance of the updated guidelines.
          </p>

          <h2>8. Questions</h2>
          <p>
            If you have questions about these guidelines, please contact us through our website or social channels.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
