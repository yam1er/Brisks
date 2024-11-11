import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <h1>Brisk</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Get in touch</a>
            </nav>
        </header>
    );
}

export default Header;
