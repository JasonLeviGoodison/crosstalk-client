import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './components/Form';
import Header from './components/Header';
import Method from './components/Method';
import './App.css';
import Room from './components/Room';
import * as routes from './routes.js'

function App() {
  const userId = localStorage.getItem('userId')
  console.log("GOT MY USER ID ITS", userId);
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path={routes.HOME} component={Form} />
          <Route exact path={routes.ROOM + "/:roomId"} component={ (props) => <Room {...props} userId={userId} /> } />
          <Route exact path={routes.METHOD} component={Method} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
