import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Transaction retrieval error', error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div>
            <h2>History of transactions</h2>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction._id}>
                        <p>ID: {transaction._id}</p>
                        <p>Fiat Amount: {transaction.fiatAmount}</p>
			<p>Sat Amount: {transaction.satAmount}</p>
                        <p>Date: {new Date(transaction.date).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TransactionHistory;
