import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://brisk-api.alphonsemehounme.tech:3000/connect',
                {},
                {
                    headers: {
                        Authorization: `${btoa(`${email}:${password}`)}`,
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('authToken', token); // Stocke le jeton pour les futures requêtes
                console.log('Logged in successfully');
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Unauthorized: Incorrect email or password');
            } else {
                setError('Connection error');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Log in</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Log in</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
