import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/create-account" component={CreateAccount} />
		<Route path="/transactions-history" component={TransactionHistory} />
            </Switch>
        </Router>
    );
}

export default App;
