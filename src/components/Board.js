import {useEffect} from 'react';
import {observer, inject} from 'mobx-react';
import { useParams, useHistory, Link } from 'react-router-dom';

const Board = inject('TicTac')(observer((props) => {
    const {TicTac} = props;
    const {gameType} = useParams();
    const history = useHistory();

    const boxClass = (box, element) => {
        let className, i;
        switch (box) {
            case '.': {
                className = 'empty-box';
                i = 'fas fa-circle';
            }
            break;
            case 'X': {
                className = 'X-box';
                i = 'fas fa-times';
            }
            break;
            case 'O': {
                className = 'O-box';
                i = 'far fa-circle';
            }
            break;
            case '.x': {
                className = 'x-option';
                i = 'fas fa-circle';
            }
            break;
            case '.o': {
                className = 'o-option';
                i = 'fas fa-circle';
            }
            break;
    }
    return element === 'div' ? className : i;
    }

    const chooseBox = (x, y) => {
        if (TicTac.popupVisible) {return}
        TicTac.chooseBox(x, y, 'click');
    }

    const displayOption = (x, y) => {
        if (TicTac.popupVisible) {return}
        TicTac.chooseBox(x, y, 'hover');
    }

    const stopDisplaying = (x, y) => {
        if (TicTac.popupVisible) {return}
        TicTac.stopDisplaying(x, y)
    }

    function endGame() {
        if (TicTac.endType === '') {return}
        history.push(`/GameOver/${TicTac.endType}`)
    }

    useEffect(() => {
        TicTac.setGame(gameType);
    }, [])

    useEffect(() => {
        endGame();
    }, [TicTac.endType])
    
    return (
        <div className = {`board ${gameType}-board ${TicTac.popupVisible && 'blured-page'}`}>
            <div className = "board-player-name">
                {TicTac.isOnline && <h2 className = "player-name">{TicTac.userName}</h2>}
                <i className ={`player-turn fas fa-times ${TicTac.currentPlayer === 'X' ? 'active-turn' : 'inactive-turn'}`}></i>
            </div>

            <div className = {`board-container ${gameType}-board-container`}>
                {TicTac.board.map((row, rowIndex) => <div key = {rowIndex} className = "row">
                    {row.map((item, itemIindex) => <div key = {itemIindex}  onMouseEnter = {() => displayOption(itemIindex, rowIndex)} onMouseLeave = {() => stopDisplaying(itemIindex, rowIndex)} className = {`box ${boxClass(item, 'div')}`} onClick = {() => chooseBox(itemIindex, rowIndex)}>
                        {gameType === 'simple' && <i className = {`box-i ${boxClass(item, 'i')}`}></i>}
                    </div>)}
                </div>)}
            </div>

            <div className = "board-player-name">
                {TicTac.isOnline && <h2 className = "player-name">{TicTac.onlineGame.partnerName}</h2>}
                <i className ={`player-turn far fa-circle ${TicTac.currentPlayer === 'O' ? 'active-turn' : 'inactive-turn'}`}></i>
            </div>

            <div className = "buttons-container">
                <Link to = {!TicTac.popupVisible && "/"}><div className = "button-div" id = {TicTac.popupVisible && 'inactive-button-div'}>
                    <h1>Exit game</h1>
                </div></Link>
            </div>
        </div>
    )
})) 

export default Board;