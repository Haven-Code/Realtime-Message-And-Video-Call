const mongoose = require('mongoose');
const User = require("../schema/user");
const Chat = require("../schema/chat");

module.exports = (io) => {

	var connectedUser = [];

	io.of("/status").on('connection', function (socket) {
		console.info("[SOCKET] Có người connect đến Server Status !");

		socket.on("load-done", (data) => {
			User.findOne({ _id: data }, (err, result) => {

				let re;

				if (err) {
					console.log(err);
					socket.emit('load-done-data', "500");
				} else if (!result) {
					socket.emit('load-done-data', "404");
				} else {
					//console.log(result.friends)
					User.find().where('_id').in(result.friends).exec((err, result) => {

						if (err) {
							console.log(err);
							socket.emit('load-done-data', "500");
						} else if (!result.length) {
							socket.emit('load-done-data', "404");
						} else {
							var array = [];
							result.forEach((user) => {

								if (user.is_online === true) {
									active = "Online";
								} else {
									active = "Offline"
								}

								let a = {
									id: user._id,
									username: user.username,
									fullname: user.fullname,
									is_online: active
								}
								array.push(a)
							})

							//console.log(array);
							socket.emit('load-done-data', array);
						}
					});
				}

			})
		})
	});

	io.of("/message").on('connection', function (socket) {
		console.log("[SOCKET] Có người connect đến Server Message !");

		socket.on('load-message-by-friend', (data) => {

			Chat.find({
				$or: [
					{ 'sender': data.user, 'reciver.user': data.friend },
					{ 'sender': data.friend, 'reciver.user': data.user }
				]
			}).sort('-createdAt').limit(10).exec((err, result) => {
				//console.log(result)
				if (err) {
					console.log(err);
					socket.emit('load-message-data', "503");
				} else if (!result.length) {
					socket.emit('load-message-data', "404");
				} else {
					socket.emit('load-message-data', result);
				}
			})
		})

		socket.on('send-userID', (data) => {
			connectedUser[data] = socket.id;
			console.log(connectedUser);
		})

		socket.on('send-message', (data) => {
			console.log(data);
			let reciverSocket = connectedUser[data.friendID];
			console.log(reciverSocket);

			//var Message = mongoose.model('Message', Chat);

			Chat.create({}, (err, chat) => {
				if (err) {
					console.log(err);
				}

				chat.reciver.push({ user: data.friendID });
				chat.sender = data.sender;
				chat.message = data.message;
				chat.save((err) => {
					if (err) {
						console.log('SAVE', err);
					}
				})
			})

			let dataRe = {
				sender: data.sender,
				reciver: data.friendID,
				message: data.message,
				createdAt: data.timestamp
			}
			io.of('/message').to(reciverSocket).emit('send-message-data', dataRe);

		})

		socket.on('load-more-message', (data) => {
			if (data !== 10) {
				Chat.find({
					$or: [
						{ 'sender': data.user, 'reciver.user': data.friend },
						{ 'sender': data.friend, 'reciver.user': data.user }
					]
				}).sort('-createdAt').skip(data.offset).limit(10).exec((err, result) => {
					//console.log(result)
					if (err) {
						console.log(err);
						socket.emit('load-more-message-data', "503");
					} else if (!result.length) {
						socket.emit('load-more-message-data', "404");
					} else {
						socket.emit('load-more-message-data', result);
					}
					
				})
			}
		})

		socket.on('calling', (data) => {
			let callingSocketID = connectedUser[data.to];
			console.log(callingSocketID);
			
			if (callingSocketID === undefined || callingSocketID === ""){
				console.log('Offline');
			}else{
				io.of('/message').to(callingSocketID).emit('calling-to', data );
			}
		})

		socket.on('decline-call', (data) => {
			let callingSocketID = connectedUser[data.from];
			console.log('Decline:',callingSocketID);
			io.of('/message').to(callingSocketID).emit('calling-declined', data );
		})

		socket.on('answer-call-peer-id', (data) => {
			socket.broadcast.emit('user-call-peer-id',data);
		})
	})

	io.of('/user').on('connection', (socket) => {
		console.log("[SOCKET] Có người connect đến Server User !");

		socket.on('get-user-by-id', (data) => {
			User.findOne({ _id: data }, { password: 0 }, (err, result) => {
				if (err) {
					console.log(err);
					socket.emit('get-user-by-id-data', "500");
				} else if (!result) {
					socket.emit('get-user-by-id-data', "404");
				} else {

					socket.emit('get-user-by-id-data', result)
				}
			});
		})

	})

}