import {observer, inject} from 'mobx-react';
import { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Partner from './Partner';

const FindPartner = inject('TicTac')(observer((props) => {
    const {TicTac} = props;
    const {userName} = useParams();
    const history = useHistory();

    useEffect(() => {
        TicTac.connectUser(userName);
        TicTac.getOpenGames();
    }, [])

    useEffect(() => {
        moveToGame();
    }, [TicTac.onlineGame])

    function moveToGame() {
        if (!TicTac.onlineGame.partnerName || TicTac.endType !== '') {return}
        history.push(`/board/${TicTac.onlineGame.gameType}`);
    }

    return (
        <div id = "findPartner">
            <h1 id = "page-title">Waiting partners</h1>

            <div id = {TicTac.openGames[0] ? "waiting-partners" : "no-waiting-partners"}>
                {TicTac.openGames.map(o => <Partner key = {o.id} partner = {o}/>)}
                {!TicTac.openGames[0] && <h1>No avliable partners</h1> }
            </div>

            <div id = "buttons-container">
                <Link to = "/chooseGame/online"><div className = "button-div">
                    <h1>Open a new game</h1>
                </div></Link>
                <Link to = '/'><div className = "button-div">
                    <h1><i className = "fas fa-home"></i>  Back to Homepage</h1>
                </div></Link>
            </div>
        </div>
    )
}))

export default FindPartner;