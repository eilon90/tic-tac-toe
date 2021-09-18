import { observable, action, computed, makeObservable } from 'mobx';
import io from 'socket.io-client';

export class TicTac {
    constructor() {
        this.rowsNum = 0;
        this.colsNum = 0;
        this.board = [];
        this.currentPlayer = 'X';
        this.turnNumber = 0;
        this.gameType = 'simple';
        this.XCells = [];
        this.OCells = [];
        this.endType = '';
        this.userName = '';
        this.socketId = '';
        this.openGames = [];
        this.isOnline = false;
        this.onlineGame = {};
        this.popupVisible = false;
        this.socket = io('http://localhost:4000', {autoConnect: false});
        this.initiateSocket();
        this.manageSocket();

        makeObservable(this, {
            rowsNum: observable,
            colsNum: observable,
            board: observable,
            currentPlayer: observable,
            turnNumber: observable,
            gameType: observable,
            XCells: observable,
            OCells: observable,
            endType: observable,
            userName: observable,
            socketId: observable,
            openGames: observable,
            onlineGame: observable,
            popupVisible: observable,
            setGame: action,
            buildBoard: action,
            get: action,
            alter: action,
            chooseBox: action,
            displayOption: action,
            stopDisplaying: action,
            playTurn: action,
            declareWinner: action,
            changePlayer: action,
            endGameWithoutWinner: action,
            connectUser: action,
            getOpenGames: action,
            joinGame: action,
            setDefault: action,
            initiateSocket: action,
            manageSocket: action,
            gameOver: computed,
        })
    }

    setGame(gameType) {
        this.gameType = gameType;
        this.board = [];
        this.currentPlayer = 'X';
        this.turnNumber = 0;
        this.XCells = [];
        this.OCells = [];
        this.endType = '';

        if (this.gameType === 'simple') {
            this.buildBoard(3, 3);
        }
        else {
            this.buildBoard(50 ,50);
        }
    }

    buildBoard(rows, cols) {
        this.rowsNum = rows;
        this.colsNum = cols;

        for (let r = 0; r < this.rowsNum; r++) {
            let row = [];
            for (let c = 0; c < this.colsNum; c++) {
                row.push('.');
            }
            this.board.push(row);
        }
    }

    get(rowNum, colNum) {
        if (rowNum < 0 || rowNum > this.rowsNum - 1 || colNum < 0 || colNum > this.colsNum - 1) {
            return undefined;
        }
        return this.board[rowNum][colNum];
    }

    alter(rowNum, colNum, val) {
        this.board[rowNum][colNum] = val;
    }

    chooseBox(x, y, action) {
        const box = this.get(y, x);
        if (this.isOnline && this.onlineGame.player !== this.currentPlayer) {return}
        if (box !== '.' && box !== '.x' && box !== '.o') {return}
        if (this.gameType === 'extended' && this.turnNumber > 0 && this.neighborsCells(x, y).every(n => n === '.' || n === undefined)) {return}
        if (action === 'hover') {this.displayOption(x, y)}
        else {
            this.playTurn(x, y);
            if (this.isOnline) {this.socket.emit ('playTurn', {partnerId: this.onlineGame.partnerId, x: x, y: y})}
        }
    }

    displayOption(x, y) {
        if (this.currentPlayer === 'X') { this.alter(y, x, '.x')}
        else { this.alter(y, x, '.o')}
    }

    stopDisplaying(x, y) {
        const box = this.get(y, x);
        if (box === '.x' || box === '.o') {
            this.alter(y, x, '.');
        }
    }

    playTurn(x, y) {
        this.alter(y, x, this.currentPlayer);

        if (this.currentPlayer === 'X') {this.XCells.push({x: x, y: y})}
        else {{this.OCells.push({x: x, y: y})}}

        if (this.gameOver) {
            this.declareWinner();
            return;
        }

        this.turnNumber++;
        if (this.turnNumber === this.colsNum * this.rowsNum) {
            this.endGameWithoutWinner();
            return;
        }

        this.changePlayer();
    }

    declareWinner() {
        this.endType = 'victory';
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    endGameWithoutWinner() {
        this.endType = 'draw';
    }

    neighborsCells(x, y) {
        return [
            this.get(y - 1, x - 1),
            this.get(y - 1, x),
            this.get(y - 1, x + 1),
            this.get(y, x - 1),
            this.get(y, x + 1),
            this.get(y + 1, x - 1),
            this.get(y + 1, x),
            this.get(y + 1, x + 1)
        ]
    }

    checkFiveInRow() {
        const arrayToCheck = this.currentPlayer === 'X' ? this.XCells : this.OCells;
        return arrayToCheck.some(a => {
            const value = this.get(a.y, a.x);
            return (this.get(a.y, a.x + 1) === value && this.get(a.y, a.x + 2) === value && this.get(a.y, a.x + 3) === value && this.get(a.y, a.x + 4) === value)
        })
    }

    checkFiveInCol() {
        const arrayToCheck = this.currentPlayer === 'X' ? this.XCells : this.OCells;
        return arrayToCheck.some(a => {
            const value = this.get(a.y, a.x);
            return (this.get(a.y + 1, a.x) === value && this.get(a.y + 2, a.x) === value && this.get(a.y + 3, a.x) === value && this.get(a.y + 4, a.x) === value)
        })
    }

    checkFiveInDiagonal1() {
        const arrayToCheck = this.currentPlayer === 'X' ? this.XCells : this.OCells;
        return arrayToCheck.some(a => {
            const value = this.get(a.y, a.x);
            return (this.get(a.y + 1, a.x + 1) === value && this.get(a.y + 2, a.x + 2) === value && this.get(a.y + 3, a.x + 3) === value && this.get(a.y + 4, a.x + 4) === value)
        })
    }

    checkFiveInDiagonal2() {
        const arrayToCheck = this.currentPlayer === 'X' ? this.XCells : this.OCells;
        return arrayToCheck.some(a => {
            const value = this.get(a.y, a.x);
            return (this.get(a.y - 1, a.x + 1) === value && this.get(a.y - 2, a.x + 2) === value && this.get(a.y - 3, a.x + 3) === value && this.get(a.y - 4, a.x + 4) === value)
        })
    }

    connectUser(userName) {
        if (this.socket.connected) {this.socket.disconnect();};
        this.userName = userName;
        this.onlineGame = {};
        this.endType = '';
        this.socket.open();
    }

    openOnlineGame(gameType) {
        if (this.endType === '') {
            const game = {
                playerId: this.socketId,
                gameType: gameType
            }
            this.socket.emit('openGame', game);
        }
        else {
            this.socket.emit('playAgain', this.onlineGame);
        }
    }

    getOpenGames() {
        this.socket.emit('getOpenGames');
    }

    joinGame(partner) {
        const partnerId = {
            id: partner.id
        }
        this.socket.emit('joinGame', partnerId);
    }

    setDefault() {
        if(!this.userName) {return}
        this.socket.disconnect();
        this.rowsNum = 0;
        this.colsNum = 0;
        this.board = [];
        this.currentPlayer = 'X';
        this.turnNumber = 0;
        this.gameType = 'simple';
        this.XCells = [];
        this.OCells = [];
        this.endType = '';
        this.userName = '';
        this.socketId = '';
        this.openGames = [];
        this.isOnline = false;
        this.onlineGame = {};
        this.popupVisible = false;
    }

    initiateSocket() {
        this.socket.on('connect', () => {
            this.socket.emit('join', this.userName);
        })
    }

    manageSocket() {
        this.socket.on('joined', data => {
            this.socketId = data.socketId;
        })

        this.socket.on('openGames', data => {
            this.openGames = data;
        })

        this.socket.on('startGame', data => {
            const game = {
                gameType: data.gameType,
                partnerName: data.name,
                partnerId: data.id,
                player: data.player
            }
            this.isOnline = true;
            this.onlineGame = game;
        })

        this.socket.on('partnerPlayed', data => {
            this.playTurn(data.x, data.y);
        })

        this.socket.on('partnerDisconnected', () => {
            this.popupVisible = true;
        })

        this.socket.on('addGameToList', data => {
            this.openGames.push(data);
        })

        this.socket.on('removeGameFromList', data => {
            let userIndex;
            this.openGames.some((o, index) => {if (o.id === data.id) {
                userIndex = index;
                return true;
            }});
            this.openGames.splice(userIndex, 1);
        })
    }

    get gameOver() {
        if (this.gameType === 'simple') {
            const rowCompleted = this.board.some(row => row.every(item => item !== '.' && item === row[0]));
            const colCompleted = this.board[0].some((item, index) => this.board.every(row => item !== '.' && row[index] === item));
            const diagonal1Completed = this.board.every((row, index) => this.board[0][0] !== '.' && row[index] === this.board[0][0]);
            const diagonal2Completed = this.board.every((row, index) => this.board[0][this.colsNum - 1] !== '.' && row[this.colsNum - index - 1] === this.board[0][this.colsNum - 1])
    
            if (rowCompleted || colCompleted || diagonal1Completed || diagonal2Completed) {return true}
        }
        else {
            if (this.checkFiveInRow() || this.checkFiveInCol() || this.checkFiveInDiagonal1() || this.checkFiveInDiagonal2()) {return true} 
        }
    }
}