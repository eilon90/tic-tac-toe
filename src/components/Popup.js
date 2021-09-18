import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';

const Popup = inject('TicTac')(observer((props) => {
    const {TicTac} = props;

    return (
        <div id = {TicTac.popupVisible ? "visible-popup" : "unvisible-popup"}>
            <h3>{TicTac.onlineGame.partnerName && `${TicTac.onlineGame.partnerName} disconnected`}</h3>
            <Link to = '/'><div className = "button-div">
                <h1>Back to Homepage</h1>
            </div></Link>
        </div>
    )
}))

export default Popup;