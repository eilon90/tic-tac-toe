import {observer, inject} from 'mobx-react';

const Partner = inject('TicTac')(observer((props) => {
    const {TicTac, partner} = props;

    const joinGame = () => TicTac.joinGame(partner);

    return (
        <div className = "partner" onClick = {joinGame}>
            <h2>{partner.name}</h2>
            <h3>{partner.gameType === 'simple' ? 'Classic 3X3' : 'Complete 5'}</h3>
        </div>
    )
}))

export default Partner;