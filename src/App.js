import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './components/Form';
import Header from './components/Header';
import Method from './components/Method';
import './App.css';
import Room from './components/Room';
import * as routes from './routes.js'

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path={routes.HOME} component={Form} />
          <Route exact path={routes.ROOM + "/:roomId"} component={Room} />
          <Route exact path={routes.METHOD} component={Method} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
