import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './providers';
import { RequireAuth, RequireRole } from '../lib/guards';
import { AnalyticsProvider } from '../components/AnalyticsProvider';
import { ToastProvider } from '../contexts/ToastContext';
import { ConfirmProvider } from '../contexts/ConfirmContext';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ScrollToTop from '../components/ScrollToTop';

// Layouts - Critical, load immediately
import Header from '../components/Header';
import Footer from '../components/Footer';

// Critical Components - Load immediately
import Hero from '../components/Hero';
import Testimonials from '../components/landing/Testimonials';
import LoadingSpinner from '../components/common/LoadingSpinner';
import WhatsAppButton from '../components/common/WhatsAppButton';
import PitchBanners from '../components/landing/PitchBanners';
import AdBanner from '../components/common/AdBanner';
import CookieConsent from '../components/common/CookieConsent';

// Lazy load all other pages for better performance
const ProviderDashboard = React.lazy(() => import('../features/providers/ProviderDashboard'));
const AccountHub = React.lazy(() => import('../features/account/AccountHub'));
const ProviderOnboarding = React.lazy(() => import('../features/providers/ProviderOnboarding'));
const ProviderSearch = React.lazy(() => import('../features/providers/ProviderSearch'));
const TriageChatbot = React.lazy(() => import('../features/jobs/TriageChatbot'));
const HowItWorksModal = React.lazy(() => import('../components/HowItWorksModal'));

// Static Pages - Lazy loaded
const AboutUs = React.lazy(() => import('../pages/AboutUs'));
const Contact = React.lazy(() => import('../pages/Contact'));
const FAQ = React.lazy(() => import('../pages/FAQ'));
const HelpCenter = React.lazy(() => import('../pages/HelpCenter'));
const PricingPlans = React.lazy(() => import('../pages/PricingPlans'));
const PrivacyPolicy = React.lazy(() => import('../pages/PrivacyPolicy'));
const ProviderBenefits = React.lazy(() => import('../pages/ProviderBenefits'));
const ProviderLanding = React.lazy(() => import('../pages/ProviderLanding'));
const ServiceRequestFlow = React.lazy(() => import('../pages/ServiceRequestFlow'));
const SuccessStories = React.lazy(() => import('../pages/SuccessStories'));
const Terms = React.lazy(() => import('../pages/Terms'));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

// New SEO and Blog pages
const ProviderProfilePage = React.lazy(() => import('../pages/ProviderProfilePage'));
const BlogList = React.lazy(() => import('../pages/BlogList'));
const BlogPost = React.lazy(() => import('../pages/BlogPost'));
const ProgrammaticLandingPage = React.lazy(() => import('../pages/ProgrammaticLandingPage'));
const PaymentStatusPage = React.lazy(() => import('../pages/PaymentStatusPage'));
const ServiceCityPage = React.lazy(() => import('../pages/ServiceCityPage'));

// Admin Pages - Lazy loaded (separate chunk)
const AdminLayout = React.lazy(() => import('../layouts/AdminLayout'));
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('../pages/admin/UserManagement'));
const ProviderReview = React.lazy(() => import('../pages/admin/ProviderReview'));
const AuditLogs = React.lazy(() => import('../pages/admin/AuditLogs'));
const Monitoring = React.lazy(() => import('../pages/admin/Monitoring'));
const Jobs = React.lazy(() => import('../pages/admin/Jobs'));
const SubscriptionsAdmin = React.lazy(() => import('../pages/admin/Subscriptions'));

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8" tabIndex={-1}>
        <Routes>
            <Route path="/" element={<div className="space-y-8 sm:space-y-10"><Hero /><AdBanner /><PitchBanners /><Testimonials /></div>} />
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

        <div className="max-w-4xl mx-auto mt-8">
          <AdBanner />
        </div>
      </main>
      <WhatsAppButton />
      <CookieConsent />
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
