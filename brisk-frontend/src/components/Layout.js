import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="layout">
            {location.pathname !== '/dashboard' && <Header />}
            
            <main className="content">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
