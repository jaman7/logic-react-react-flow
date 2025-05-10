import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineDashboard } from 'react-icons/ai';
import { RiExchangeDollarLine } from 'react-icons/ri';
import classNames from 'classnames';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { useGlobalStore } from '@/store/useGlobalStore';
import './Sidebar.scss';

export const sidebarItems = [
  { path: '/', label: 'Dashboard', Icon: AiOutlineDashboard },
  { path: '/logic-minimizer', label: 'logic-minimizer', Icon: RiExchangeDollarLine },
];

const Sidebar: FC = () => {
  const isSideBarOpen = useGlobalStore((state) => state.isSideBarOpen);
  const { setIsSideBarOpen } = useGlobalStore();

  return (
    <>
      <motion.aside
        className={`sidebar ${isSideBarOpen ? 'open' : 'collapsed'}`}
        initial={{ width: isSideBarOpen ? 240 : 4 }}
        animate={{ width: isSideBarOpen ? 240 : 56 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="menu-nav">
          <ul className={classNames('menu', { open: isSideBarOpen })}>
            {sidebarItems.map(({ path, label, Icon }, i) => (
              <li key={`menu-item-${i}`}>
                <NavLink
                  to={path}
                  key={path}
                  className={({ isActive, isPending }) =>
                    classNames('menu-item target-tooltip', {
                      pending: isPending,
                      active: isActive,
                      close: !isSideBarOpen,
                    })
                  }
                  data-pr-tooltip={!isSideBarOpen ? label || '' : ''}
                  data-pr-classname="target-tooltip shadow-none"
                  data-pr-position="right"
                >
                  <Icon size={24} className="icon" />
                  <span className={classNames('label', { open: isSideBarOpen })}>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button handleClick={setIsSideBarOpen} variant={ButtonVariant.ROUND} aria-label="Toggle sidebar">
          {!isSideBarOpen ? <FaChevronRight /> : <FaChevronLeft />}
        </Button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
