let onlineCount = 0;
let quizList = ['APPLE', 'BANANA', 'CAT', 'NTUST', 'BATALK'];
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on('connect', () => {
    client.flushdb();
    client.set('roomId', '1');
});

module.exports = function (io) {
    io.on('connection', socket => {

        // Update online count and broadcast to all users.
        onlineCount++;
        io.emit('refreshOnlineCount', onlineCount);

        // Create a room for user or match user to a room.
        socket.on('login', async (userName) => {
            // Check whether the idle room is existed.
            if (await client.hlen('idleRoomList') == 0) {
                // Create new room and record the roomID for user.
                let newRoomId = await client.get('roomId');
                let newRoom = '{"id": ' + newRoomId + ', "players": [{"name": "' + userName + '", "socketId": "' + socket.id + '", "status": "wait"}], "quiz": "", "quizNo": "0", "drawer": "-1", "timestamp": ""}';
                await socket.join(newRoomId);
                await client.incrby('roomId', 1);
                await client.hset('idleRoomList', newRoomId, newRoom);
                await client.set(socket.id, newRoomId);
            } else {
                // Join the idle room and broadcast gotoGameUI event in the room.
                let findRoomId = (await client.hkeys('idleRoomList'))[0];
                let findRoomString = await client.hget('idleRoomList', findRoomId);
                let findRoom = JSON.parse(findRoomString);
                findRoom.players.push({ name: userName, socketId: socket.id, status: "wait" });
                await client.set(socket.id, findRoomId);
                await socket.join(findRoomId);
                await client.hset('fullRoomList', findRoomId, JSON.stringify(findRoom));
                await client.hdel('idleRoomList', findRoomId);
                io.sockets.in(findRoomId).emit('gotoGameUI', findRoom);
            }
        })

        // Clear the room when user CANCEL LOGIN action.
        socket.on('cancel', async () => {
            let roomId = await client.get(socket.id);
            await client.del(socket.id);
            await client.hdel('idleRoomList', roomId);
        })

        // Update user status to READY when the page is loaded completely.
        socket.on('getReady', async (roomId) => {
            let roomInfo = JSON.parse(await client.hget('fullRoomList', roomId));
            let readyPlayer = (roomInfo.players).find((player) => {
                return player.socketId == socket.id;
            })
            readyPlayer.status = 'ready';
            let readyPlayers = (roomInfo.players).filter((player) => {
                return player.status == 'ready';
            })
            await client.hset('fullRoomList', roomId, JSON.stringify(roomInfo));
            // Start the game when all the users is ready.
            if (readyPlayers.length == 2) {
                let quiz = quizList[Math.floor(Math.random() * 5)];
                let timestamp = Date.now();
                roomInfo.quiz = quiz;
                (roomInfo.players).forEach((e) => {
                    e.status = 'start';
                })
                roomInfo.timestamp = timestamp;
                roomInfo.drawer = (++roomInfo.drawer) % 2;
                io.to((roomInfo.players)[roomInfo.drawer].socketId).emit('isDrawer');
                roomInfo.quizNo++;
                await client.hset('fullRoomList', roomId, JSON.stringify(roomInfo));
                io.sockets.in(roomId).emit('gameStart', timestamp);
            }
        })

        // Update user status to END when time's up.
        socket.on('gameEnd', async (roomId) => {
            let roomInfo = JSON.parse(await client.hget('fullRoomList', roomId));
            let endPlayer = (roomInfo.players).find((player) => {
                return player.socketId == socket.id;
            })
            endPlayer.status = 'end';
            await client.hset('fullRoomList', roomId, JSON.stringify(roomInfo));
            let endPlayers = (roomInfo.players).filter((player) => {
                return player.status == 'end';
            })
            // Broadcast answer to all the users in the room.
            if (endPlayers.length == 2 && roomInfo.quizNo == 4) {
                io.sockets.in(roomId).emit('wholeGameEnd', roomInfo.quiz);
                await client.del(socket.id);
                await client.hdel('fullRoomList', roomId);
            } else if (endPlayers.length == 2) {
                io.sockets.in(roomId).emit('gameEnd', roomInfo.quiz);
            }
        })
        /* Syncronize the canvas START */
        socket.on('mouseDown', async (point) => {
            let roomId = await client.get(socket.id);
            socket.to(roomId).broadcast.emit('mouseDown', point);
        })

        socket.on('mouseUp', async () => {
            let roomId = await client.get(socket.id);
            socket.to(roomId).broadcast.emit('mouseUp');
        })

        socket.on('mouseLeave', async () => {
            let roomId = await client.get(socket.id);
            socket.to(roomId).broadcast.emit('mouseLeave');
        })

        socket.on('mouseMove', async (point) => {
            let roomId = await client.get(socket.id);
            socket.to(roomId).broadcast.emit('mouseMove', point);
        })
        /* Syncronize the canvas END */
        // Check whether the message is equal to answer.
        socket.on('guess', async (guessMsg) => {
            let roomId = await client.get(socket.id);
            let roomInfo = JSON.parse(await client.hget('fullRoomList', roomId));
            if (guessMsg.toUpperCase() == (roomInfo.quiz).toUpperCase()) {
                (roomInfo.players).forEach((e) => {
                    e.status = 'end';
                })
                await client.hset('fullRoomList', roomId, JSON.stringify(roomInfo));
                socket.emit('correctGuess');
                io.sockets.in(roomId).emit('gameEnd', roomInfo.quiz);
                if (roomInfo.quizNo == 4) {
                    io.sockets.in(roomId).emit('wholeGameEnd', roomInfo.quiz);
                    await client.del(socket.id);
                    await client.hdel('fullRoomList', roomId);
                }
            }
        })
        // Syncronize the message block.
        socket.on('onMessage', (messageInfo) => {
            messageInfo = JSON.parse(messageInfo);
            socket.to(messageInfo.roomId).broadcast.emit('onMessage', messageInfo.message);
        })
        // Clear the user data.
        socket.on('disconnect', async () => {
            onlineCount--;
            io.emit('refreshOnlineCount', onlineCount);
            let roomId = await client.get(socket.id);
            if (roomId != null) {
                await client.del(socket.id);
                await client.hdel('fullRoomList', roomId);
                io.sockets.in(roomId).emit('otherUserDisconnect');
            }
        })
    });
}