import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAdmin, onAdminLogout }) => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🗳️ Blockchain Voting
                </Link>

                <div className="nav-menu">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>

                    {!isAdmin && (
                        <Link
                            to="/voter"
                            className={`nav-link ${location.pathname === '/voter' ? 'active' : ''}`}
                        >
                            Cast Vote
                        </Link>
                    )}

                    <Link
                        to="/admin"
                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        {isAdmin ? 'Dashboard' : 'Admin'}
                    </Link>

                    {isAdmin && (
                        <button onClick={onAdminLogout} className="nav-logout">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;