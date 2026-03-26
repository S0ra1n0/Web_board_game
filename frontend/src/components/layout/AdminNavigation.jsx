import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/hub', label: 'Client Hub' },
];

const AdminNavigation = () => {
    return (
        <nav className="shell-nav" aria-label="Admin navigation">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `shell-nav-link${isActive ? ' shell-nav-link-active' : ''}`}
                >
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
};

export default AdminNavigation;
