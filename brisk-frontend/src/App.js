import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import TransactionHistory from './components/TransactionHistory';
import Dashboard from './components/Dashboard.js';
import Layout from './components/Layout';

function App() {
    return (
        <Router>
	  <Layout>
            <Routes>
	        <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/transactions-history" element={<TransactionHistory />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
	   </Layout>
        </Router>
    );
}

export default App;
