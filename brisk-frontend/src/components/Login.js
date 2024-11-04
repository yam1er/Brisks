import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://brisk-api.alphonsemehounme.tech:3000/connect', { email, password });
            if (response.status === 201) {
                console.log('Logged in successfully');
                // Rediriger
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    return (
        <div>
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
                <label>Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Log in</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;
