import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
//import { FaHistory, FaCog } from 'react-icons/fa'; // Import des icônes depuis react-icons

function Dashboard() {
    const [xof, setXof] = useState('');
    const [satoshi, setSatoshi] = useState('');
    const [conversionRate, setConversionRate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [paymentLink, setPaymentLink] = useState('');
    const [error, setError] = useState('');
    const [loadingRate, setLoadingRate] = useState(false);
    const [loadingLink, setLoadingLink] = useState(false);
    const [balanceUSD, setBalanceUSD] = useState(0);  
    const [balanceSatoshi, setBalanceSatoshi] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://brisk-api.alphonsemehounme.tech:3000/users/me', {
                    headers: {
                        "X-Token": `${localStorage.getItem('authToken')}`,
                    },
                });
                const userData = response.data;
                setBalanceUSD(userData.balanceFiat);
                setBalanceSatoshi(userData.balanceSat);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchConversionRate = async () => {
            setLoadingRate(true);
            try {
                const response = await axios.get('http://brisk-api.alphonsemehounme.tech:3000/rates');
                const btcToXofRate = response.data.rate;
                const satoshiRate = btcToXofRate / 100000000;
                setConversionRate(satoshiRate);
            } catch (error) {
                setError('Error retrieving conversion rate');
                console.error('Error retrieving conversion rate', error);
            } finally {
                setLoadingRate(false);
            }
        };
        fetchConversionRate();
    }, []);

     useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://brisk-api.alphonsemehounme.tech:3000/invoices', {
                    headers: {
                        "X-Token": `${localStorage.getItem('authToken')}`,
                    },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error in transactions récupération", error);
            }
        };

        fetchTransactions();
    }, []);

    const handleXofChange = (e) => {
        setError('');
	if (e.target.value >= 0)
	{
        	const xofValue = e.target.value;
        	setXof(xofValue);
        	if (conversionRate) {
            	setSatoshi((xofValue / conversionRate).toFixed(8));
        	}
	}else
		setXof(0);
    };

    const handleSatoshiChange = (e) => {
        setError('');
	if (e.target.value >= 0)
	{
        	const satoshiValue = e.target.value;
        	setSatoshi(satoshiValue);
        	if (conversionRate) {
            	setXof((satoshiValue * conversionRate).toFixed(2));
        	}
	}else
		setSatoshi(0);
    };

    const generatePaymentLink = async () => {
        setLoadingLink(true);
        setError('');
        try {
            const response = await axios.post(
                'http://brisk-api.alphonsemehounme.tech:3000/invoices',
                {
                    amount: satoshi,
                    title: 'Payment',
                    description: 'Invoice payment'
                },
                {
                    headers: {
                        "X-Token": `${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true
                }
            );
            
            const paymentUrl = response.data?.checkoutLink;
            if (paymentUrl) {
                setPaymentLink(paymentUrl);
                setShowPopup(true);
            } else {
                setError('Payment link not found in the response');
            }
        } catch (error) {
            setError('Error generating payment link');
            console.error('Error generating payment link', error);
        } finally {
            setLoadingLink(false);
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="profile.jpg" alt="Profile" className="profile-pic" />
                    <h3>Nom du Compte</h3>
                </div>
                <nav className="menu">
                    <div className="menu-item">
                        <span>Historique</span>
                    </div>
                    <div className="menu-item">
                        <span>Paramètres</span>
                    </div>
                </nav>
            </aside>
            
            <main className="main-content">
                <h2 className="dasboard">Dashboard</h2>
                {loadingRate ? (
                    <p>Loading conversion rate...</p>
                ) : (
                    <>
			<div className="balance-container">
			    <div className="balance-block">
			        <h3>Balance in dollar</h3>
			        <p>{balanceUSD || '0.00'} USD</p>
			    </div>
			    <div className="balance-block">
			        <h3>Balance in Satoshi</h3>
			        <p>{balanceSatoshi || '0'} Sats</p>
			    </div>
			</div>


			<div className="create">
			<h2 className="center">Create Invoice</h2>
			<div className="center">
                        <label className="dlabel">

                            Amount (USD):
                            <input
                                type="number"
                                value={xof}
                                onChange={handleXofChange}
                                placeholder="Enter amount in USD"
                            />
                        </label>
                        <label className="dlabel">
                            Amount (Satoshi):
                            <input
                                type="number"
                                value={satoshi}
                                onChange={handleSatoshiChange}
                                placeholder="Enter amount in Satoshi"
                            />
                        </label>
			</div>
			<div className="center bdiv">
                        <button className="button" onClick={generatePaymentLink} disabled={loadingLink}>		
                            {loadingLink ? 'Generating link...' : 'Generate payment link'}
                        </button>
			</div>
			</div>
                    </>
                )}

                {error && <p className="error-message">{error}</p>}

		<div className="transaction-history">
                <h3>Transaction History</h3>
                {transactions.length > 0 ? (
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Creation Date</th>
                                <th>Status</th>
                                <th>Paiement link</th>
                            </tr>
                        </thead>
                        <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.id || 'N/A'}</td>
                                <td>{transaction.amount || '0'} SATS</td>
                                <td>{transaction.createdTime ? new Date(transaction.createdTime * 1000).toLocaleString() : 'N/A'}</td>
                                <td>{transaction.status || 'N/A'}</td>
                                <td>
                                    {transaction.checkoutLink ? (
                                        <a href={transaction.checkoutLink} target="_blank" rel="noopener noreferrer">
                                            View Link
                                        </a>
                                    ) : (
                                        'Link not available'
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No transactions found</td>
                        </tr>
                    )}
                </tbody>
                    </table>
                ) : (
                    <p>Transaction not found</p>
                )}
            </div>

                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h3>Payment link generated</h3>
                            <p>Amount (USD): {xof}</p>
                            <p>Amount (Satoshi): {satoshi}</p>
                            <p>
                                Payment Link: <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a>
                            </p>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
