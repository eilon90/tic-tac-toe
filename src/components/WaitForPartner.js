import {observer, inject} from 'mobx-react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {useEffect} from 'react';

const WaitForPartner = inject('TicTac')(observer((props) => {
    const {TicTac} = props;
    const {gameType, player} = useParams();
    const history = useHistory();

    useEffect(() => {
        TicTac.openOnlineGame(gameType);
    }, [])

    useEffect(() => {
        moveToGame();
    }, [TicTac.onlineGame.player])

    function moveToGame() {
        if (TicTac.endType === '' && !TicTac.onlineGame.partnerName) {return}
        if (TicTac.endType !== '' && TicTac.onlineGame.player === player) {return}
        history.push(`/board/${TicTac.onlineGame.gameType}`);
    }

    const text = TicTac.endType === '' ? 'Waiting for partner...' : `Waiting for ${TicTac.onlineGame.partnerName}...`

    return (
        <div id = "waitForPartner" className = {`${TicTac.popupVisible && 'blured-page'}`}>
            <h1 id = "page-title">{text}</h1>
            <div  id = "buttons-container">
                <Link to = {`/findPartner/${TicTac.userName}`}><div className = "button-div">
                    <h1>Back to open games</h1>
                </div></Link>
            </div>
        </div>
    )
}))

export default WaitForPartner;