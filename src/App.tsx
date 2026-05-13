import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';
import { logoDark } from './data';

const HomePage      = lazy(() => import('./pages/HomePage'));
const DistroPage    = lazy(() => import('./pages/DistroPage'));
const StudioPage    = lazy(() => import('./pages/StudioPage'));
const PromotionPage = lazy(() => import('./pages/PromotionPage'));
const SpotlightPage = lazy(() => import('./pages/SpotlightPage'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));

function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <img src={logoDark} alt="Dwad Music" className="w-40 opacity-80" />
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

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [pathname]);

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

function AppLayout() {
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
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="*"          element={<HomePage />} />
          </Routes>
        </Suspense>
      </AnimatedPage>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
