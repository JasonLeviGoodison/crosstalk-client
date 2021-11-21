import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
//import Method from './components/Method';
import './App.css';
import Room from './components/Room';
import * as routes from './routes.js';
import * as userApi from './api/userApi';
import { useEffect, useState } from 'react';
import Home from './components/Home';
import Feedback from './components/Feedback';

function App() {
  const [userId, setUserId] = useState('');
  useEffect(() => {
    async function fetchData() {
      let loadedUserId = await userApi.GetUserId();
      setUserId(loadedUserId);
    }
    fetchData();
  }, []);

  console.log("GOT MY USER ID ITS", userId);
  return (
    <div className="App">
      <div id="field">
      <Router>
        <Header />
        <Switch>
          <Route exact path={routes.HOME} component={Home} />
          <Route exact path={routes.ROOM + "/:roomId"} component={ (props) => {
            if (userId === '') return 'Loading';
            return (<Room {...props} userId={userId} />);
          } } />
          { /*<Route exact path={routes.METHOD} component={Method} />
          <Route exact path={routes.FEEDBACK} component={Feedback} /> */}
        </Switch>
      </Router>
      </div>
    </div>
  );
}

export default App;
