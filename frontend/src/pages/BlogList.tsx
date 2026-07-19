import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_ARTICLES } from '../data/blogArticles';
import Card from '../components/common/Card';
import AdBanner from '../components/common/AdBanner';

const BlogList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Precios', 'Problemas Comunes', 'Comparativas'];

  // Filtrado de artículos
  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const pageTitle = "Blog Automotriz | Consejos, Precios y Fallas Comunes | RedMecánica";
  const pageDesc = "Explora nuestro blog automotriz con artículos sobre precios de talleres, guías de fallas eléctricas, comparativas de grúas y consejos de expertos mecánicos en Chile.";
  const currentUrl = "https://redmecanica.cl/blog";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://redmecanica.cl/logo-meta.jpg" />
      </Helmet>

      {/* Blog Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider mb-3">
          📚 Blog de Consejos Automotrices
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Guías y Consejos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expertos</span> Mecánicos
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Infórmate sobre precios del mercado, soluciones a problemas mecánicos frecuentes y comparativas detalladas en Chile para tomar la mejor decisión con tu vehículo.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <Card className="p-5 mb-10 border border-gray-100 shadow-sm bg-white/80 backdrop-blur rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="w-full md:max-w-sm relative">
          <input
            type="text"
            placeholder="🔍 Buscar artículo por palabras clave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-150 hover:border-blue-300'
              }`}
            >
              {cat === 'All' ? '🗂️ Todos' : cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <span className="text-4xl block mb-2">📋</span>
          <p className="font-bold text-gray-800 text-lg">No encontramos artículos para tu búsqueda</p>
          <p className="text-xs text-gray-500 mt-1">Prueba quitando filtros o escribiendo otra palabra clave.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <React.Fragment key={article.slug}>
            <Card 
              className="group flex flex-col border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
            >
              <Link to={`/blog/${article.slug}`} className="flex flex-col h-full">
                {/* Article Image wrapper */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
                    {article.category}
                  </div>
                </div>

                {/* Content area */}
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-gray-400 block mb-2">
                    ⏱️ {article.readTime} • {article.publishDate}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-6 flex-1">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <span className="text-xs font-bold text-gray-800">
                      Por: <span className="text-blue-600">{article.author}</span>
                    </span>
                    <span className="text-xs font-black text-blue-600 group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                      Leer Más <span className="text-sm">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
            {(index + 1) % 4 === 3 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <AdBanner className="my-2" />
              </div>
            )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
