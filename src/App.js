import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Storyboard from './components/Storyboard';
import Menu from './components/Menu';
import Home from './components/Home';
import NavBar from './components/NavBar';



function App() {
  return (
    <Router>
      <div className="App">
          <div className = "nav">
            <NavBar></NavBar>
          </div>
          <Routes>
            <Route exact path = "/" element={<Home reference="home"/>}/>
            <Route exact path = "/storyboard" element={<Storyboard/>}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
