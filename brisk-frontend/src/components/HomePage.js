
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Add styling if needed

function HomePage() {
    const navigate = useNavigate();

    const goToSignup = () => {
        navigate('/create-account');
    };

    return (
        <div className="homepage-container">
            <h1>Welcome to Brisk</h1>
            <p>The best way to integrate bitcoin payment</p>
            <button className="get-started-button" onClick={goToSignup}>
                Get Started
            </button>
        </div>
    );
}

export default HomePage;

