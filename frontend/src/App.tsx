import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Pages
import { HomePage } from './pages/HomePage';
import { CoursesCatalogPage } from './pages/CoursesCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CourseWatchPlayerPage } from './pages/CourseWatchPlayerPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isWatchPage = location.pathname.includes('/watch');

  return (
    <div className="flex flex-col min-h-screen">
      {!isWatchPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isWatchPage && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesCatalogPage />} />
              <Route path="/course/:slug" element={<CourseDetailPage />} />
              <Route path="/course/:slug/watch" element={<CourseWatchPlayerPage />} />
              <Route path="/course/:slug/watch/:lessonId" element={<CourseWatchPlayerPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  );
};

export default App;
