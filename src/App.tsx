import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';
import { logoWhite } from './data';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AdminRoute from './routes/AdminRoute';
import ArtistRoute from './routes/ArtistRoute';

// ── Public pages ──────────────────────────────────────────────────────────────
const HomePage      = lazy(() => import('./pages/HomePage'));
const DistroPage    = lazy(() => import('./pages/DistroPage'));
const StudioPage    = lazy(() => import('./pages/StudioPage'));
const PromotionPage = lazy(() => import('./pages/PromotionPage'));
const SpotlightPage = lazy(() => import('./pages/SpotlightPage'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));
const GraphicsPage    = lazy(() => import('./pages/GraphicsPage'));
const PublishingPage  = lazy(() => import('./pages/PublishingPage'));
const RoyaltiesPage    = lazy(() => import('./pages/RoyaltiesPage'));
const ManagementPage   = lazy(() => import('./pages/ManagementPage'));
const AkiibStudioPage  = lazy(() => import('./pages/AkiibStudioPage'));
const AkiibMusicPage   = lazy(() => import('./pages/AkiibMusicPage'));
const LegalPage        = lazy(() => import('./pages/LegalPage'));
const BeatsPage        = lazy(() => import('./pages/BeatsPage'));
const RadioPage        = lazy(() => import('./pages/RadioPage'));
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('./pages/ResetPasswordPage'));
const ArtistSignupPage   = lazy(() => import('./pages/ArtistSignupPage'));
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'));

// ── Dashboard layouts ──────────────────────────────────────────────────────────
const AdminLayout  = lazy(() => import('./layouts/AdminLayout'));
const ArtistLayout = lazy(() => import('./layouts/ArtistLayout'));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminOverviewPage       = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminArtistsPage        = lazy(() => import('./pages/admin/AdminArtistsPage'));
const AdminArtistDetailPage   = lazy(() => import('./pages/admin/AdminArtistDetailPage'));
const AdminSubscriptionsPage  = lazy(() => import('./pages/admin/AdminSubscriptionsPage'));
const AdminUploadsPage        = lazy(() => import('./pages/admin/AdminUploadsPage'));
const AdminStatsPage          = lazy(() => import('./pages/admin/AdminStatsPage'));
const AdminReportsPage        = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminNotificationsPage  = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminProductionsPage    = lazy(() => import('./pages/admin/AdminProductionsPage'));
const AdminBeatsPage          = lazy(() => import('./pages/admin/AdminBeatsPage'));
const AdminCurrencyRatesPage  = lazy(() => import('./pages/admin/AdminCurrencyRatesPage'));

// ── Artist pages ──────────────────────────────────────────────────────────────
const ArtistHomePage      = lazy(() => import('./pages/artist/ArtistHomePage'));
const ArtistReleasesPage  = lazy(() => import('./pages/artist/ArtistReleasesPage'));
const ArtistAnalyticsPage = lazy(() => import('./pages/artist/ArtistAnalyticsPage'));
const ArtistIncomePage    = lazy(() => import('./pages/artist/ArtistIncomePage'));
const ArtistUploadPage    = lazy(() => import('./pages/artist/ArtistUploadPage'));

// ── Shared utilities ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <img src={logoWhite} alt="Dwad Music" className="w-40 opacity-80" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setVisible(false);
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [renderedPathname]);

  return (
    <main
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
        minHeight: '100vh',
      }}
    >
      {children}
    </main>
  );
}

// ── Public layout (with Topbar + Footer) ──────────────────────────────────────
function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Topbar />
      <AnimatedPage>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/distro"    element={<DistroPage />} />
            <Route path="/studio"    element={<StudioPage />} />
            <Route path="/promotion" element={<PromotionPage />} />
            <Route path="/spotlight" element={<SpotlightPage />} />
            <Route path="/graphics"    element={<GraphicsPage />} />
            <Route path="/publishing"   element={<PublishingPage />} />
            <Route path="/royalties"     element={<RoyaltiesPage />} />
            <Route path="/management"    element={<ManagementPage />} />
            <Route path="/akiibstudio"   element={<AkiibStudioPage />} />
            <Route path="/akiibmusic"    element={<AkiibMusicPage />} />
            <Route path="/legal"     element={<LegalPage />} />
            <Route path="/beats"     element={<BeatsPage />} />
            <Route path="/radio"     element={<RadioPage />} />
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/join/:token" element={<ArtistSignupPage />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AnimatedPage>
      <Footer />
    </>
  );
}

// ── Root router ───────────────────────────────────────────────────────────────
function AppRouter() {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/artist');

  if (isDashboard) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="artists" element={<AdminArtistsPage />} />
            <Route path="artists/:id" element={<AdminArtistDetailPage />} />
            <Route path="stats" element={<AdminStatsPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="uploads" element={<AdminUploadsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="productions" element={<AdminProductionsPage />} />
            <Route path="beats" element={<AdminBeatsPage />} />
            <Route path="currency-rates" element={<AdminCurrencyRatesPage />} />
          </Route>

          {/* Artist routes */}
          <Route path="/artist" element={<ArtistRoute><ArtistLayout /></ArtistRoute>}>
            <Route path="home"      element={<ArtistHomePage />} />
            <Route path="releases"  element={<ArtistReleasesPage />} />
            <Route path="analytics" element={<ArtistAnalyticsPage />} />
            <Route path="income"    element={<ArtistIncomePage />} />
            <Route path="upload"    element={<ArtistUploadPage />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return <PublicLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
