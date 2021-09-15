import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// components
import Home from './components/pages/home/Home';
import Map from './components/pages/map/Map';
import GoogleMaps from './components/pages/GoogleMaps/GoogleMaps';

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
