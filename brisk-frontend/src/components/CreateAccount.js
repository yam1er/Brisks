import React, { useState } from 'react';
import axios from 'axios';

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
                setSuccess('Account created successfully!');
            }
        } catch (err) {
            setError('Account creation error');
        }
    };

    return (
        <div>
            <h2>Create an account</h2>
            <form onSubmit={handleSubmit}>
                <label>Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Create an account</button>
            </form>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    );
}

export default CreateAccount;
