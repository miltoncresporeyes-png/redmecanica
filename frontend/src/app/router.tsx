import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './providers';
import { RequireAuth, RequireRole } from '../lib/guards';
import { AnalyticsProvider } from '../components/AnalyticsProvider';
import { ToastProvider } from '../contexts/ToastContext';
import { ConfirmProvider } from '../contexts/ConfirmContext';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ScrollToTop from '../components/ScrollToTop';
import { lazyWithRetry } from '../lib/lazyWithRetry';

// Layouts - Critical, load immediately
import Header from '../components/Header';
import Footer from '../components/Footer';

// Critical Components - Load immediately
import Hero from '../components/Hero';
import LoadingSpinner from '../components/common/LoadingSpinner';
// Lazy load non-critical components
const Testimonials = lazyWithRetry(() => import('../components/landing/Testimonials'));
const WhatsAppButton = lazyWithRetry(() => import('../components/common/WhatsAppButton'));
const PitchBanners = lazyWithRetry(() => import('../components/landing/PitchBanners'));
const CookieConsent = lazyWithRetry(() => import('../components/common/CookieConsent'));
const NewsletterModal = lazyWithRetry(() => import('../components/common/NewsletterModal'));

// Lazy load all other pages for better performance
const ProviderDashboard = lazyWithRetry(() => import('../features/providers/ProviderDashboard'));
const AccountHub = lazyWithRetry(() => import('../features/account/AccountHub'));
const ProviderOnboarding = lazyWithRetry(() => import('../features/providers/ProviderOnboarding'));
const ProviderSearch = lazyWithRetry(() => import('../features/providers/ProviderSearch'));
const TriageChatbot = lazyWithRetry(() => import('../features/jobs/TriageChatbot'));
const HowItWorksModal = lazyWithRetry(() => import('../components/HowItWorksModal'));

// Static Pages - Lazy loaded
const AboutUs = lazyWithRetry(() => import('../pages/AboutUs'));
const Contact = lazyWithRetry(() => import('../pages/Contact'));
const FAQ = lazyWithRetry(() => import('../pages/FAQ'));
const HelpCenter = lazyWithRetry(() => import('../pages/HelpCenter'));
const PricingPlans = lazyWithRetry(() => import('../pages/PricingPlans'));
const PrivacyPolicy = lazyWithRetry(() => import('../pages/PrivacyPolicy'));
const ProviderBenefits = lazyWithRetry(() => import('../pages/ProviderBenefits'));
const ProviderLanding = lazyWithRetry(() => import('../pages/ProviderLanding'));
const ServiceRequestFlow = lazyWithRetry(() => import('../pages/ServiceRequestFlow'));
const SuccessStories = lazyWithRetry(() => import('../pages/SuccessStories'));
const Terms = lazyWithRetry(() => import('../pages/Terms'));
const NotFoundPage = lazyWithRetry(() => import('../pages/NotFoundPage'));

// New SEO and Blog pages
const ProviderProfilePage = lazyWithRetry(() => import('../pages/ProviderProfilePage'));
const BlogList = lazyWithRetry(() => import('../pages/BlogList'));
const BlogPost = lazyWithRetry(() => import('../pages/BlogPost'));
const ProgrammaticLandingPage = lazyWithRetry(() => import('../pages/ProgrammaticLandingPage'));
const PaymentStatusPage = lazyWithRetry(() => import('../pages/PaymentStatusPage'));
const ServiceCityPage = lazyWithRetry(() => import('../pages/ServiceCityPage'));

// Admin Pages - Lazy loaded (separate chunk)
const AdminLayout = lazyWithRetry(() => import('../layouts/AdminLayout'));
const AdminDashboardPage = lazyWithRetry(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazyWithRetry(() => import('../pages/admin/UserManagement'));
const ProviderReview = lazyWithRetry(() => import('../pages/admin/ProviderReview'));
const AuditLogs = lazyWithRetry(() => import('../pages/admin/AuditLogs'));
const Monitoring = lazyWithRetry(() => import('../pages/admin/Monitoring'));
const Jobs = lazyWithRetry(() => import('../pages/admin/Jobs'));
const SubscriptionsAdmin = lazyWithRetry(() => import('../pages/admin/Subscriptions'));

// Helper for Modal Page
const HowItWorksPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <HowItWorksModal onClose={() => navigate('/')} />
        </Suspense>
    );
};

// Lazy Route wrapper with loading state
const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
);

const MainLayout: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showNewsletter, setShowNewsletter] = React.useState(false);

    React.useEffect(() => {
      // Mostrar el modal después de 5 segundos
      const timer = setTimeout(() => setShowNewsletter(true), 5000);
      return () => clearTimeout(timer);
    }, []);

  return (
    <div className="min-h-dvh bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8" tabIndex={-1}>
        <Routes>
            <Route path="/" element={<div className="space-y-8 sm:space-y-10"><Hero /><Suspense fallback={null}><PitchBanners /><Testimonials /></Suspense></div>} />
           <Route path="/onboarding" element={<LazyRoute><ProviderOnboarding onComplete={() => navigate('/provider-dashboard')} onCancel={() => navigate('/')} /></LazyRoute>} />
           <Route path="/search" element={<LazyRoute><ProviderSearch /></LazyRoute>} />
           <Route path="/triage" element={<LazyRoute><TriageChatbot /></LazyRoute>} />
           <Route path="/how-it-works" element={<HowItWorksPage />} />
           <Route path="/about" element={<LazyRoute><AboutUs onClose={() => navigate('/')} onNavigateToOnboarding={() => navigate('/onboarding')} /></LazyRoute>} />
           <Route path="/contact" element={<LazyRoute><Contact onClose={() => navigate('/')} /></LazyRoute>} />
           <Route path="/faq" element={<LazyRoute><FAQ onClose={() => navigate('/')} /></LazyRoute>} />
           <Route path="/help" element={<LazyRoute><HelpCenter onClose={() => navigate('/')} /></LazyRoute>} />
            <Route path="/pricing" element={<LazyRoute><PricingPlans onClose={() => navigate('/')} onNavigateToOnboarding={() => navigate('/onboarding')} /></LazyRoute>} />
           <Route path="/privacy" element={<LazyRoute><PrivacyPolicy onClose={() => navigate('/')} /></LazyRoute>} />
           <Route path="/benefits" element={<LazyRoute><ProviderBenefits onClose={() => navigate('/')} onNavigateToPricing={() => navigate('/pricing')} onNavigateToOnboarding={() => navigate('/onboarding')} /></LazyRoute>} />
           <Route path="/unete" element={<LazyRoute><ProviderLanding /></LazyRoute>} />
           <Route path="/solicitar" element={<LazyRoute><ServiceRequestFlow /></LazyRoute>} />
           <Route path="/servicio" element={<LazyRoute><ServiceRequestFlow /></LazyRoute>} />
           <Route path="/stories" element={<LazyRoute><SuccessStories onClose={() => navigate('/')} /></LazyRoute>} />
           <Route path="/terms" element={<LazyRoute><Terms onClose={() => navigate('/')} /></LazyRoute>} />
           
           {/* Blog and SEO indexable routes */}
           <Route path="/blog" element={<LazyRoute><BlogList /></LazyRoute>} />
           <Route path="/blog/:slug" element={<LazyRoute><BlogPost /></LazyRoute>} />
           <Route path="/proveedor/:id" element={<LazyRoute><ProviderProfilePage /></LazyRoute>} />
           <Route path="/payment/return" element={<LazyRoute><PaymentStatusPage /></LazyRoute>} />
           <Route path="/payment/final" element={<LazyRoute><PaymentStatusPage /></LazyRoute>} />
           
           {/* Service + City directory pages for SEO density */}
           <Route path="/mecanicos/:citySlug" element={<LazyRoute><ServiceCityPage /></LazyRoute>} />
           <Route path="/gruas/:citySlug" element={<LazyRoute><ServiceCityPage /></LazyRoute>} />
           <Route path="/talleres/:citySlug" element={<LazyRoute><ServiceCityPage /></LazyRoute>} />
           <Route path="/electricos/:citySlug" element={<LazyRoute><ServiceCityPage /></LazyRoute>} />
           
           {/* Programmatic SEO dynamic URL landing page */}
           <Route path="/:seoSlug" element={<LazyRoute><ProgrammaticLandingPage /></LazyRoute>} />
           
           {/* 404 - Not Found */}
           <Route path="*" element={<LazyRoute><NotFoundPage /></LazyRoute>} />
           
           <Route element={<RequireAuth />}>
               <Route path="/profile" element={<LazyRoute><AccountHub currentUser={user} onClose={() => navigate('/')} /></LazyRoute>} />
           </Route>

           <Route element={<RequireRole roles={['MECHANIC', 'WORKSHOP', 'TOWING']} />}>
               <Route path="/provider-dashboard" element={<LazyRoute><ProviderDashboard onClose={() => navigate('/')} /></LazyRoute>} />
           </Route>
        </Routes>
      </main>
      <Suspense fallback={null}>
        <WhatsAppButton />
        <CookieConsent />
        {showNewsletter && <NewsletterModal onClose={() => setShowNewsletter(false)} />}
      </Suspense>
      <Footer />
    </div>
  );
};

// Refactoring App to use new Providers and Router structure
const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ToastProvider>
                    <ConfirmProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <AnalyticsProvider>
                                <Routes>
                                    {/* Admin Routes - Separate lazy chunk */}
                                    <Route path="/admin" element={<RequireRole roles={['ADMIN', 'SUPER_ADMIN']} />}>
                                        <Route element={<Suspense fallback={<LoadingSpinner fullScreen />}><AdminLayout /></Suspense>}>
                                            <Route index element={<Suspense fallback={<LoadingSpinner />}><AdminDashboardPage /></Suspense>} />
                                            <Route path="users" element={<Suspense fallback={<LoadingSpinner />}><UserManagement /></Suspense>} />
                                            <Route path="providers" element={<Suspense fallback={<LoadingSpinner />}><ProviderReview /></Suspense>} />
                                            <Route path="jobs" element={<Suspense fallback={<LoadingSpinner />}><Jobs /></Suspense>} />
                                            <Route path="audit" element={<Suspense fallback={<LoadingSpinner />}><AuditLogs /></Suspense>} />
                                            <Route path="monitoring" element={<Suspense fallback={<LoadingSpinner />}><Monitoring /></Suspense>} />
                                            <Route path="subscriptions" element={<Suspense fallback={<LoadingSpinner />}><SubscriptionsAdmin /></Suspense>} />
                                            <Route path="stats" element={<Suspense fallback={<LoadingSpinner />}><AdminDashboardPage /></Suspense>} />
                                        </Route>
                                    </Route>

                                    {/* Main App Routes */}
                                    <Route path="/*" element={<MainLayout />} />
                                </Routes>
                            </AnalyticsProvider>
                        </BrowserRouter>
                    </ConfirmProvider>
                </ToastProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
