import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import './MainLayout.scss';

const MainLayout: FC = () => (
  <div className="layout">
    <Sidebar />
    <div className="layout-content">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;
