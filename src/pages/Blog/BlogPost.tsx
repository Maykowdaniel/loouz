import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Calendar, User, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const relatedPosts = post ? getRelatedPosts(post.slug, 2) : [];

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Louuz Blog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", post.metaDescription);
      }
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-white hover:text-cyan-400 transition-colors"
          >
            lo<span className="text-cyan-400">uu</span>z
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/blog" className="text-cyan-400 font-semibold text-sm">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumbs */}
              <Breadcrumb className="mb-8">
                <BreadcrumbList className="text-zinc-400 text-sm">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="hover:text-white transition-colors">
                        Home
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/blog" className="hover:text-white transition-colors">
                        Blog
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-zinc-300">{post.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Title & Meta */}
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8">
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-2">
                  <User size={18} />
                  {post.author}
                </span>
              </div>

              {/* Featured image */}
              <div className="rounded-2xl overflow-hidden mb-10 border border-white/5">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full aspect-video object-cover"
                />
              </div>

              {/* Content - safe HTML rendering */}
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: post.content.trim() }}
              />

              {/* Mobile CTA (shown when sidebar is hidden) */}
              <div className="lg:hidden my-12 p-6 bg-zinc-900/80 border border-cyan-500/20 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-3">Try Louuz Chat</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Ready to meet someone new? Start chatting instantly—no login required.
                </p>
                <Link
                  to="/"
                  className="inline-block py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  Start Chatting Now
                </Link>
              </div>

              {/* FAQ Section */}
              <section className="mt-16 pt-12 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {post.faq.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`faq-${idx}`}
                      className="border border-white/10 rounded-xl px-4 bg-zinc-900/50 data-[state=open]:border-cyan-500/30 transition-colors"
                    >
                      <AccordionTrigger className="text-left text-white hover:no-underline hover:text-cyan-400 py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-400 pb-5 pr-8">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-16 pt-12 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/blog/${p.slug}`}
                        className="group block bg-zinc-900/50 rounded-xl border border-white/5 p-5 hover:border-cyan-500/30 transition-all"
                      >
                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-zinc-400 text-sm">
                          {format(new Date(p.date), "MMM d, yyyy")}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>

          {/* Sticky Sidebar - CTA (Desktop) */}
          <aside className="lg:w-80 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-zinc-900/80 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">Try Louuz Chat</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Ready to meet someone new? Start chatting instantly—no login required. The best Omegle alternative is one click away.
                </p>
                <Link
                  to="/"
                  className="block w-full text-center py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  Start Chatting Now
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
