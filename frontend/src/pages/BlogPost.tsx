import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { BLOG_ARTICLES } from '../data/blogArticles';
import Card from '../components/common/Card';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Buscar el post correspondiente
  const post = useMemo(() => {
    return BLOG_ARTICLES.find(article => article.slug === slug);
  }, [slug]);

  // Si no se encuentra el post, redirige a la lista
  React.useEffect(() => {
    if (!post) {
      navigate('/blog', { replace: true });
    }
  }, [post, navigate]);

  // Obtener artículos recomendados (excluyendo el actual)
  const relatedArticles = useMemo(() => {
    if (!post) return [];
    return BLOG_ARTICLES
      .filter(article => article.slug !== post.slug)
      .slice(0, 2);
  }, [post]);

  if (!post) {
    return null;
  }

  const pageTitle = `${post.title} | Blog RedMecánica`;
  const pageDesc = post.description;
  const currentUrl = `https://redmecanica.cl/blog/${post.slug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.publishDate} />
        <meta property="article:author" content={post.author} />
      </Helmet>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-gray-900 font-extrabold truncate max-w-[200px]">{post.title}</span>
      </div>

      {/* Main Post Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="inline-block bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded mb-4">
          {post.category}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
          {post.title}
        </h1>
        
        {/* Author Metadata */}
        <div className="flex items-center justify-center gap-3 mt-4 text-xs">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200">
            {post.author.charAt(0)}
          </div>
          <div className="text-left">
            <span className="font-bold text-gray-900 block">{post.author}</span>
            <span className="text-gray-400 block text-[10px] mt-0.5">{post.authorRole}</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <div className="text-gray-500 font-medium">
            ⏱️ {post.readTime} • 📅 {post.publishDate}
          </div>
        </div>
      </div>

      {/* Large Featured Image */}
      <div className="rounded-3xl overflow-hidden h-[300px] md:h-[450px] w-full shadow-lg mb-10">
        <img
          src={post.image}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Left Side: Article Content */}
        <div className="lg:col-span-3">
          <article 
            className="prose prose-blue max-w-none text-gray-700 leading-relaxed text-sm space-y-6 
                       prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tight 
                       prose-h2:text-xl prose-h2:pt-4 prose-h3:text-lg prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Social share mock / end signoff */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-medium">RedMecánica Chile © 2026</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compartir:</span>
              <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center text-xs transition-colors">f</button>
              <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-500 hover:text-sky-600 flex items-center justify-center text-xs transition-colors">in</button>
              <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-green-50 text-slate-500 hover:text-green-600 flex items-center justify-center text-xs transition-colors">wa</button>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Sidebar CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm rounded-2xl text-center">
              <span className="text-[28px] block mb-2">🚗</span>
              <h4 className="font-extrabold text-blue-950 text-sm mb-2">¿Necesitas un servicio hoy?</h4>
              <p className="text-[11px] text-blue-800/80 mb-6 leading-relaxed">
                Cotiza con cientos de mecánicos certificados y talleres en tu comuna sin perder tiempo.
              </p>
              <Link
                to="/solicitar"
                className="w-full text-center block bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
              >
                🛠️ Cotizar Gratis
              </Link>
            </Card>

            <Card className="p-5 border border-gray-100 shadow-sm">
              <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-widest mb-3">📍 Regiones Activas</h4>
              <div className="flex flex-col gap-2 text-xs font-bold text-gray-600">
                <Link to="/mecanico-en-santiago" className="hover:text-blue-600">🔧 Santiago Metropolitana</Link>
                <Link to="/mecanico-en-valparaiso" className="hover:text-blue-600">🔧 Valparaíso</Link>
                <Link to="/mecanico-en-concepcion" className="hover:text-blue-600">🔧 Biobío</Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Recommended Articles Carousel / Grid */}
      <div className="pt-10 border-t border-gray-100">
        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6">
          📖 Artículos Recomendados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedArticles.map(article => (
            <Card 
              key={article.slug}
              className="p-4 border border-gray-100 hover:border-blue-200 transition-all rounded-xl"
            >
              <Link to={`/blog/${article.slug}`} className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <span className="bg-slate-100 text-slate-700 font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded self-start">
                    {article.category}
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">
                    ⏱️ {article.readTime}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
