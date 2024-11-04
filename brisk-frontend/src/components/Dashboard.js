import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const [xof, setXof] = useState('');
    const [satoshi, setSatoshi] = useState('');
    const [conversionRate, setConversionRate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchConversionRate = async () => {
            try {
                const response = await axios.get('http://brisk-api.alphonsemehounme.tech:3000/rates');
                const btcToXofRate = response.data.rate;
                const satoshiRate = btcToXofRate / 100000000; // Conversion BTC -> satoshi
                setConversionRate(satoshiRate);
            } catch (error) {
                console.error('Error retrieving conversion rate', error);
            }
        };
        fetchConversionRate();
    }, []);

    const handleXofChange = (e) => {
        const xofValue = e.target.value;
        setXof(xofValue);
        if (conversionRate) {
            setSatoshi((xofValue / conversionRate).toFixed(8));
        }
    };

    const handleSatoshiChange = (e) => {
        const satoshiValue = e.target.value;
        setSatoshi(satoshiValue);
        if (conversionRate) {
            setXof((satoshiValue * conversionRate).toFixed(2));
        }
    };

    const generatePaymentLink = () => {
        setShowPopup(true);
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <label>
                Amount (USD):
                <input
                    type="number"
                    value={xof}
                    onChange={handleXofChange}
                    placeholder="Enter amount in USD"
                />
            </label>
            <label>
                Amount (Satoshi):
                <input
                    type="number"
                    value={satoshi}
                    onChange={handleSatoshiChange}
                    placeholder="Enter amount in Satoshi"
                />
            </label>
            <button onClick={generatePaymentLink}>Generate payment link</button>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Payment link generated</h3>
                        <p>Amount (USD) : {xof}</p>
                        <p>Amount (Satoshi) : {satoshi}</p>
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
