import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import TransactionHistory from './components/TransactionHistory';
import Dashboard from './components/Dashboard.js';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/create-account" component={CreateAccount} />
		<Route path="/transactions-history" component={TransactionHistory} />
		<Route path="/dashboard" component={Dashboard} />
            </Switch>
        </Router>
    );
}

export default App;
