/***
 * 
 * Socket Controller
 */

 const debug = require('debug')('game:socket_controller');
 let io = null; // socket.io server instance

// list of rooms and their connected users
const users = {}
const rooms = [
	{
		id: 'room1',
		name: 'Room one',
		users: {},
	},
	{
		id: 'room2',
		name: 'Room two',
		users: {},
	},
	{
		id: 'room3',
		name: 'Room three',
		users: {},
	},
	{
		id: 'room4',
		name: 'Room four',
		users: {},
	},
];

const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);

	// find the room that this socket is part of
	const room = rooms.find(chatroom => chatroom.users.hasOwnProperty(this.id));

	// if socket was not in a room, don't broadcast disconnect
	if (!room) {
		return;
	}

	// let everyone in the room know that this user has disconnected
	this.broadcast.to(room.id).emit('user:disconnected', room.users[this.id]);

	// remove user from list of users in that room
	delete room.users[this.id];

	// broadcast list of users in room to all connected sockets EXCEPT ourselves
	this.broadcast.to(room.id).emit('user:list', room.users);
}

// Handle when a user has joined the chat
const handleUserJoined = function(username, room_id, callback) {
	debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);

	// join room
	this.join(room_id);

	// add socket to list of online users in this room
	// a) find room object with `id` === `general`
	const room = rooms.find(chatroom => chatroom.id === room_id)

	// b) add socket to room's `users` object
	room.users[this.id] = username;

	// let everyone know that someone has connected to the chat
	this.broadcast.to(room.id).emit('user:connected', username);

	// confirm join
	callback({
		success: true,
		roomName: room.name,
		users: room.users
	});

	// broadcast list of users in room to all connected sockets EXCEPT ourselves
	this.broadcast.to(room.id).emit('user:list', room.users);
}






// Handle when a user has joined the chat
const handleUserFire = function(username, room_id, time) {
	


	// debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);
	function randomColumnRow () {
		return Math.ceil(Math.random() * 8)
	}
 
	const row = randomColumnRow();
	const column = randomColumnRow();

	const room = rooms.find(rom => rom.id === room_id)

	if (!room.points) {
        room.points = []
    }
    const point = { 
		username: username,point: time
    }
	
    room.points.push(point)
    console.log({rooms});

	room.points.forEach(element => {
		console.log(element);
		if (username === element.username) {
			element.point
			console.log(room.points);
		}

		room.users[this.id] = username;



// broadcast list of users in room to all connected sockets EXCEPT ourselves

        this.broadcast.to(room.id).emit('room:point', username);

        console.log(point)
	});
	

	
		//  { --> Room
		// 	id: 'room1',
		// 	name: 'Room one',
		// 	users: {
		// 		gsg2NtXO0QOuDnPwAAAF: 'Heidi',
		// 		yZk0ubEbX_hP72jmAAAH: 'daniel'
		// 	}
		// }

  
	console.log({room, username, time})
	io.to(room.id).emit('damageDone', username, time, row, column);

		
}







const handleChatMessage = function(message) {
	debug('Someone said something: ', message);

	// emit `chat:message` event to everyone EXCEPT the sender
	this.broadcast.to(message.room).emit('chat:message', message);
}

module.exports = function(socket, _io) {
	io = _io;

	debug('a new client has connected', socket.id);



	io.emit("new-connection", "A new user connected");

	io.emit("new-connection", "A new user connected");

	// io.to(room).emit();
	socket.on('user:fire', handleUserFire)

	// handle user disconnect
	socket.on('disconnect', handleDisconnect);

	// handle user joined
	socket.on('user:joined', handleUserJoined);

	// handle user emitting a new message
	socket.on('chat:message', handleChatMessage);
}