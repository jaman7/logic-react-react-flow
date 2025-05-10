import { FC } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.scss';
import UserNavbar from './UserNavbar';

const Header: FC = () => (
  <header className="header">
    <h1>Logic symulator</h1>

    <div className="d-flex align-items-center gap-8">
      <LanguageSwitcher />
      <UserNavbar />
    </div>
  </header>
);

export default Header;
