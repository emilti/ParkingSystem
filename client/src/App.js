import logo from './logo.svg';
import './App.css';
import Header from './Components/header';
import Vehicles from './Components/vehicles';
import { BrowserRouter, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Parking system</h1>
      <BrowserRouter>
        <Header/>
      </BrowserRouter>
      <Vehicles/>
    </div>
  );
}

export default App;
