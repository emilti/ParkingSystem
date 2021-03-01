import logo from './logo.svg';
import './App.css';
import Navigation from './Components/Navigation'
import HomePage from './Pages/Home'
import EnterVehiclePage from './Pages/EnterVehicle'
import {
  BrowserRouter,
    Switch,
    Route,
    Link
  } from 'react-router-dom'
function App() {
  return (
    <div className="App">
      <h1>Parking system</h1>
       <BrowserRouter>
        <Navigation/>
        <Switch>
                    <Route path="/" exact component={HomePage}/>
                    <Route path="/EnterVehicle" component={EnterVehiclePage}/>
                </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
