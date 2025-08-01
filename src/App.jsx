import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path='*'
          element={
            <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
