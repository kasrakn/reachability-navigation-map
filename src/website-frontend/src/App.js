import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// components
import Map from './components/pages/map/Map';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={ Map } />
        </Switch>
      </Router>
    </div>
  );
}
export default App;
