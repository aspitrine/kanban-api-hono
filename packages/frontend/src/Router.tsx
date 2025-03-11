import { Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout/MainLayout';
import LoginPage from './pages/LoginPage/LoginPage';

function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
