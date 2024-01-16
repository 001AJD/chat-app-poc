import { randomUUID } from "crypto";
let connection = {};

const registerSocketEventHandlers = (wss) => {
	// handle connection event
	wss.on("connection", (socket, request) => {
		if (connection.hasOwnProperty(request.headers.username)) {
			console.error(
				`The ${request.headers.username} username is not available. Closing connection`
			);
			socket.send(
				"Username not available. Try with another username. Closing connection"
			);
			socket.terminate();
		} else {
			connection[request.headers.username] = socket;
			socket.clientId = randomUUID();
			socket.username = request.headers.username;
			console.log(`The ${socket.username} user is connected`);
			socket.send(`User ${socket.username} connected to server`);
		}

		// handle message received from the client event
		socket.on("message", (message) => {
			let msg = JSON.parse(message);
			if (connection.hasOwnProperty(msg.sendTo)) {
				console.log(`sending message to user ${msg.sendTo}`);
				let client = connection[msg.sendTo];
				let response = {
					from: socket.username,
					message: msg.message,
				};
				client.send(JSON.stringify(response));
			} else {
				let response = `The user ${msg.sendTo} is not available at the moment`;
				socket.send(response);
			}
		});

		// handle connection close event
		socket.on("close", (statusCode) => {
			delete connection[socket.username]; // delete websocket connection from connection object
			if (statusCode === 1000) {
				console.log(`The ${socket.username} user is disconnected`);
			} else {
				console.log("websocket connection closed due an error");
			}
		});
	});
};

export { registerSocketEventHandlers };
