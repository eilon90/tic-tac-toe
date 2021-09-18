import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom';

const GameOver = inject('TicTac')(observer((props) => {
    const {TicTac} = props;
    let title = '';
    
    if (TicTac.endType === 'draw') {title = "It's a draw..."}
    else if (!TicTac.isOnline) {title = `${TicTac.currentPlayer} is the winner!`}
    else if (TicTac.currentPlayer === TicTac.onlineGame.player) {title = 'You won!'}
    else {title = 'You loosed...'}

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

    const link = TicTac.isOnline ? `/waitForPartner/${TicTac.gameType}/${TicTac.onlineGame.player}` : `/board/${TicTac.gameType}`;

    return (
        <div id = "game-over" className = {`${TicTac.popupVisible && 'blured-page'}`}>
            <h1 id = "page-title">{title}</h1>
            
            <div className = {`board-container ${TicTac.gameType}-board-container`}>
                {TicTac.board.map((row, rowIndex) => <div key = {rowIndex} className = "row">
                    {row.map((item, itemIindex) => <div key = {itemIindex} className = {`box ${boxClass(item, 'div')}`}>
                    {TicTac.gameType === 'simple' && <i className = {`box-i ${boxClass(item, 'i')}`}></i>}
                    </div>)}
                </div>)}
            </div>

            <div id = "buttons-container">
                <Link to = {!TicTac.popupVisible && link}><div className = "button-div" id = {TicTac.popupVisible && 'inactive-button-div'}>
                    <h1>Play again</h1>
                </div></Link>
                <Link to = '/'><div className = "button-div">
                    <h1><i className = "fas fa-home"></i>  Back to Homepage</h1>
                </div></Link>
            </div>
        </div>
    )
}))

export default GameOver;