import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
    { to: '/hub', label: 'Game Hub' },
    { to: '/profile', label: 'Profile' },
    { to: '/users', label: 'Find Users' },
];

const ClientNavigation = () => {
    return (
        <nav className="shell-nav" aria-label="Client navigation">
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

export default ClientNavigation;
