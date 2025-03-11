import { Outlet } from 'react-router';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
