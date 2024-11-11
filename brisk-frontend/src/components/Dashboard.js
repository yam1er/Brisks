import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './Dashboard.css';
import BriskImage from '../Brisk.png';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const navigate = useNavigate();
    const [invoiceSatoshi, setInvoiceSatoshi] = useState('');
    const [invoiceUSD, setInvoiceUSD] = useState('');
    const [conversionRate, setConversionRate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [paymentLink, setPaymentLink] = useState('');
    const [loadingLink, setLoadingLink] = useState(false);
    const [error, setError] = useState('');

    const [balanceUSD, setBalanceUSD] = useState(0);
    const [balanceSatoshi, setBalanceSatoshi] = useState(0);

    const [swapSatoshi, setSwapSatoshi] = useState('');
    const [swapUSD, setSwapUSD] = useState('');
    const [swapType, setSwapType] = useState('sats_to_usd');

    const [transactions, setTransactions] = useState([]);

    // Logout function
    const handleLogout = async () => {
        try {
           // await axios.post('http://brisk-api.alphonsemehounme.tech:3000/logout', {}, {
               // headers: {
                 //   "X-Token": `${localStorage.getItem('authToken')}`,
              //  },
               // withCredentials: true
          //  });

           // localStorage.removeItem('authToken');

            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Error logging out', error);
        }}

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://brisk-api.alphonsemehounme.tech:3000/users/me', {
                headers: { "X-Token": `${localStorage.getItem('authToken')}` },
            });
            const userData = response.data;
            setBalanceUSD(userData.balanceFiat);
            setBalanceSatoshi(userData.balanceSat);
        } catch (error) {
            console.error("Erreur lors de la récupération des informations de l'utilisateur", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchConversionRate = async () => {
            try {
                const response = await axios.get('http://brisk-api.alphonsemehounme.tech:3000/rates');
                const btcToXofRate = response.data.rate;
                const satoshiRate = btcToXofRate / 100000000;
                setConversionRate(satoshiRate);
            } catch (error) {
                setError('Error retrieving conversion rate');
                console.error('Error retrieving conversion rate', error);
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

    const handleInvoiceUSDChange = (e) => {
        const usdValue = e.target.value;
        setInvoiceUSD(usdValue);
        if (conversionRate) {
            setInvoiceSatoshi(Math.ceil((usdValue / conversionRate).toFixed(2)));
        }
    };

    const handleInvoiceSatoshiChange = (e) => {
        const satValue = e.target.value;
        setInvoiceSatoshi(satValue);
        if (conversionRate) {
            setInvoiceUSD((satValue * conversionRate).toFixed(2));
        }
    };

    const generatePaymentLink = async () => {
        setLoadingLink(true);
        setError('');
        try {
            const response = await axios.post(
                'http://brisk-api.alphonsemehounme.tech:3000/invoices',
                {
                    amount: invoiceSatoshi,
                    title: 'Payment',
                    description: 'Invoice payment'
                },
                {
                    headers: { "X-Token": `${localStorage.getItem('authToken')}` },
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

    const handleSwapUSDChange = (e) => {
        const usdValue = e.target.value;
        setSwapUSD(usdValue);
        if (conversionRate) {
            setSwapSatoshi(Math.ceil((usdValue / conversionRate).toFixed(2)));
            setSwapType('fiattosat');
        }
    };

    const handleSwapSatoshiChange = (e) => {
        const satValue = e.target.value;
        setSwapSatoshi(satValue);
        if (conversionRate) {
            setSwapUSD((satValue * conversionRate).toFixed(2));
            setSwapType('sattofiat');
        }
    };

    const handleSwap = async () => {
        try {
            const response = await axios.post(
                'http://brisk-api.alphonsemehounme.tech:3000/swap',
                {
                    fiatAmount: swapUSD,
                    satAmount: swapSatoshi,
                    type: swapType,
                },
                {
                    headers: { 'X-Token': `${localStorage.getItem('authToken')}` },
                    withCredentials: true,
                }
            );

            await fetchUserData();
            setError('');
        } catch (error) {
            setError('Error processing swap');
            console.error('Error processing swap', error);
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="profile-section">
                    <img src={BriskImage} alt="Profile" className="profile-pic" />
                    <h2>Brisk Company</h2>
                </div>
                <nav className="menu">
                    <div className="menu-item">
                        <span>Transactions</span>
                    </div>
                    <div className="menu-item">
                        <span>settings</span>
                    </div>
                </nav>
		<div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <h2 className="dashboard">Dashboard</h2>

                {/* Section des balances */}
                <div className="balance-container">
		    <div className="balance-block">
                        <h3>Balance in Satoshi</h3>
                        <p>{balanceSatoshi || '0'} Sats</p>
                    </div>
                    <div className="balance-block">
                        <h3>Balance in USD</h3>
                        <p>{balanceUSD.toFixed(2) || '0.00'} USD</p>
                    </div>
                </div>

                {/* Section de génération de facture */}
                <div className="create invoice">
                    <h2 className="center">Create Invoice</h2>
                    <div className="center">
                        <label>
                            Amount (USD):
                            <input
                                type="number"
                                value={invoiceUSD}
                                onChange={handleInvoiceUSDChange}
                                placeholder="Enter amount in USD"
                            />
                        </label>
                        <label>
                            Amount (Satoshi):
                            <input
                                type="number"
                                value={invoiceSatoshi}
                                onChange={handleInvoiceSatoshiChange}
                                placeholder="Enter amount in Satoshi"
                            />
                        </label>
                    </div>
                    <button className="button" onClick={generatePaymentLink} disabled={loadingLink}>
                        {loadingLink ? 'Generating link...' : 'Generate payment link'}
                    </button>
                </div>

                {/* Section de swap */}
                <div className="conversion-form swap">
                    <h2>Swap</h2>
                    <label>Amount (USD):</label>
                    <input
                        type="number"
                        value={swapUSD}
                        onChange={handleSwapUSDChange}
                        placeholder="amount in USD"
                    />
                    <label>Amount (Satoshi):</label>
                    <input
                        type="number"
                        value={swapSatoshi}
                        onChange={handleSwapSatoshiChange}
                        placeholder="amount in Satoshi"
                    />
		    <label>Conversion type:</label>
                    <select value={swapType} onChange={(e) => setSwapType(e.target.value)}>
                        <option value="sattofiat">Sats to USD</option>
                        <option value="fiattosat">USD to Sats</option>
                    </select>
                    <button className="button" onClick={handleSwap}>Convert</button>
                </div>

                {/* Section historique des transactions */}
                <div className="transaction-history">
                    <h2 className="center">Transaction History</h2>
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
                                {transactions.map((transaction) => (
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
                                ))}
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
                            <p>Amount (USD): {invoiceUSD}</p>
                            <p>Amount (Satoshi): {invoiceSatoshi}</p>
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
