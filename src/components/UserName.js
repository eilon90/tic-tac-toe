import {Link} from 'react-router-dom';
import {useState} from 'react';

function UserName() {
    const [userName, setUserName] = useState('');

    const typeUserName = e => {
        let str = e.target.value;
        if (str.length > 18) {
            str = str.slice(0, 17);
        } 
        setUserName(str);
    };

    return (
        <div id = "userName">
            <h1 id = "page-title">Connect online</h1>

            <div id = "user-name-insert">
                <h1>Insert your name:</h1>
                <input placeholder = "Name" value = {userName} onChange = {typeUserName}/>
            </div>

            <div id = "buttons-container">
                {userName === '' && <div id = "button-inside-div"><div id = "disabled-div" className = "button-div">
                    <h1>Continue</h1>
                </div></div>}

                {userName !== '' && <Link to = {`findPartner/${userName}`}>
                    <div className = "button-div">
                        <h1>Continue</h1>
                    </div>
                </Link>}
            </div>
        </div>
    )
}

export default UserName;