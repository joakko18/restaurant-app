import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';
import LogoutButton from './logoutButton';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="logo">
          <LogoutButton/>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Menu">Menus</Link>
          </li>
          <li>
            <Link to="/Pedidos">Pedidos</Link>
          </li>
        </ul>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
