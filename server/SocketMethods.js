const socketIo = require('socket.io');

class SocketMethods {
    constructor (server, cors) {
        this.io = socketIo(server, cors);
        this.io.on('connection', this.connect);
        this.activeUsers = [];

    }

    connect = client => {
        this.newConnection(client);
        this.openGame(client);
        this.getOpenGames(client);
        this.joinGame(client);
        this.playTurn(client);
        this.playAgain(client);
        this.disconnection(client);
    }

    newConnection = client => {
        client.on('join', data => {
            this.activeUsers.push({name: data, id: client.id, status: 'entered'});
            client.emit('joined', {socketId: client.id});
            console.log(`${data} connected`);
        });
    }



    disconnection = client => {
        client.on('disconnect', () => {
            const user = {}
            this.activeUsers.some((a, index) => {if (a.id === client.id) {
                user.index = index;
                user.name = a.name;
                user.status = a.status;
                return true;
            }});

            if (user.status === 'playing' || user.status === 'wait to restart') {
                const partnerId = this.activeUsers[user.index].partnerId;
                client.to(partnerId).emit('partnerDisconnected');
            }

            if (user.status === 'waiting') {
                const enteredUsers = this.activeUsers.filter(a => a.status === 'entered');
                enteredUsers.forEach(e => client.to(e.id).emit('removeGameFromList', user))
            }

            this.activeUsers.splice(user.index, 1);
            console.log(`${user.name} disconnected`);
        })
    }

    openGame = client => {
        client.on('openGame', data => {
            const user = this.activeUsers.find(a => a.id === data.playerId);
            user.status = 'waiting';
            user.gameType = data.gameType;

            const enteredUsers = this.activeUsers.filter(a => a.status === 'entered');
            enteredUsers.forEach(e => client.to(e.id).emit('addGameToList', user))
        })
    }

    getOpenGames = client => {
        client.on('getOpenGames', () => {
            const waitingUsers = this.activeUsers.filter(a => a.status === 'waiting');
            client.emit('openGames', waitingUsers);
        })
    }

    joinGame = client => {
        client.on('joinGame', data => {
            const player1 = this.activeUsers.find(a => a.id === data.id);
            const player2 = this.activeUsers.find(a => a.id === client.id);
            player2.gameType = player1.gameType;
            player1.status = 'playing';
            player2.status = 'playing';
            player1.partnerId = player2.id;
            player2.partnerId = player1.id;
            player1.player = 'O';
            player2.player = 'X';
            client.to(player1.id).emit('startGame', player2);
            client.emit('startGame', player1);

            const enteredUsers = this.activeUsers.filter(a => a.status === 'entered');
            enteredUsers.forEach(e => client.to(e.id).emit('removeGameFromList', player1))
        })
    }

    playTurn = client => {
        client.on('playTurn', data => {
            client.to(data.partnerId).emit('partnerPlayed', {x: data.x, y: data.y});
        })
    }

    playAgain = client => {
        client.on('playAgain', data => {
            const clientPlayer = this.activeUsers.find(a => a.id === client.id);
            const partner = this.activeUsers.find(a => a.id === data.partnerId);
            switch (partner.status) {
                case 'wait to restart': {
                    partner.status = 'playing';
                    clientPlayer.player = data.player; 
                    partner.player = data.player === 'X' ? 'O' : 'X';
                    client.to(partner.id).emit('startGame', clientPlayer);
                    client.emit('startGame', partner); 
                };
                break;
                case 'playing': clientPlayer.status = 'wait to restart';
                break;
                default: {}
                break;
            }
        })
    }
}

module.exports = SocketMethods;