import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';
import { useEffect } from 'react';

const LandPage = inject('TicTac')(observer((props) => {
    const {TicTac} = props;

    useEffect(() => {
        TicTac.setDefault();
    }, [])

    return (
        <div id = "landPage">
            <h1 id = "app-title">TIC TAC TOE</h1>
            <div id = "buttons-container">
                <Link to = "userName"><div className = "button-div">
                    <i className="button-i fas fa-globe-americas"></i>
                    <h1>Play Online</h1>
                </div></Link>
                <Link to = "chooseGame/notOnline"><div className = "button-div">
                <i className="button-i fas fa-desktop"></i>
                    <h1>Play on one computer</h1>
                </div></Link>
            </div>
        </div>
    )
}))

export default LandPage;