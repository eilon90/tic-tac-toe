import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import LandPage from './components/LandPage';
import Board from './components/Board';
import ChooseGame from './components/ChooseGame';
import FindPartner from './components/FindPartner';
import UserName from './components/UserName';
import WaitForPartner from './components/WaitForPartner';
import GameOver from './components/GameOver';
import Popup from './components/Popup';

function App() {
  return (
    <div id = "app">
      <Router>
        <Route path = "/" exact component = {LandPage} />
        <Route path = "/board/:gameType" exact component = {Board} />
        <Route path = "/chooseGame/:isOnline" exact component = {ChooseGame} />
        <Route path = "/findPartner/:userName" exact component = {FindPartner} />
        <Route path = "/userName" exact component = {UserName} />
        <Route path = "/waitForPartner/:gameType/:player" exact component = {WaitForPartner} />
        <Route path = "/gameOver/:endType" exact component = {GameOver} />
        <Popup/>
      </Router>
    </div>
  );
}

export default App;
