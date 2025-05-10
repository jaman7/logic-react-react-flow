import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Suspense, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import LogicMinimizer from '@/pages/LogicMinimizer/LogicMinimizer';
import PrivateRoute from '@/core/auth/PrivateRoute';
import AuthProvider from '@/core/auth/AuthProvider';
import ScreenLoader from '@/shared/components/ScreenLoader';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/auth/Login';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AppRoutes = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');
    const namespaces = ['common', currentPath];
    namespaces.forEach((ns) => {
      if (!i18n.hasResourceBundle(i18n.language, ns)) {
        i18n.loadNamespaces(ns);
      }
    });
  }, [location, i18n]);

  return (
    <AuthProvider>
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login path="/login" />} />
            <Route path="/logout" element={<Login path="/logout" />} />
            <Route path="/signup" element={<Login path="/signup" />} />
            <Route path="/forgot-password" element={<Login path="/forgot-password" />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                    <Dashboard />
                  </motion.div>
                }
              />
              <Route
                path="/logic-minimizer"
                element={
                  <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                    <LogicMinimizer />
                  </motion.div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRoutes;
