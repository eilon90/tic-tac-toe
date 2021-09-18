import {Link, useParams} from 'react-router-dom';

function ChooseGame() {
    const {isOnline} = useParams();

    return (
        <div id = "chooseGame">
            <h1 id = "page-title">Choose game</h1>
            <div id = "buttons-container">
                <Link to = {isOnline === 'online' ? "/waitForPartner/simple/X" : "/board/simple"}><div className = "button-div">
                    <h1>Classic Tic-Tac-Toe 3X3</h1>
                </div></Link>
                <Link to = {isOnline === 'online' ? "/waitForPartner/extended/X" : "/board/extended"}><div className = "button-div">
                    <h1>Complete Five</h1>
                </div></Link>
            </div>
        </div>
    )
}

export default ChooseGame;