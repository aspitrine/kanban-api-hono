import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import MainLayout from './layouts/MainLayout/MainLayout.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
