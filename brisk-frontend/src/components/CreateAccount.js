import React, { useState } from 'react';
import axios from 'axios';
import './CreateAccount.css';

function CreateAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://brisk-api.alphonsemehounme.tech:3000/users', { email, password });
            if (response.status === 201) {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login'; // Redirection vers la page de connexion
                }, 2000);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('Account already exists');
            } else {
                setError('Account creation error');
            }
        }
    };

    return (
        <div className="create-account-container">
            <div className="create-account-box">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Create Account</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
}

export default CreateAccount;
